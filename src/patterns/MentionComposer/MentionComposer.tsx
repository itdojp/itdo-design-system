import { useEffect, useId, useMemo, useState } from 'react';
import clsx from 'clsx';
import { AttachmentField } from '../AttachmentField';
import { DEFAULT_MENTION_COMPOSER_LIMITS } from './MentionComposer.limits';
import type { MentionComposerProps, MentionTarget } from './MentionComposer.types';
import './MentionComposer.css';

const toTargetKey = (target: MentionTarget) => `${target.kind}:${target.id}`;

const filterByQuery = (items: MentionTarget[], query: string) => {
  const normalized = query.toLowerCase();
  return items.filter((item) => `${item.id} ${item.label}`.toLowerCase().includes(normalized));
};

const mergeUniqueTargets = (items: MentionTarget[]) => {
  const map = new Map<string, MentionTarget>();
  items.forEach((item) => map.set(toTargetKey(item), item));
  return Array.from(map.values());
};

const pickConstraintError = (
  bodyLength: number,
  mentionLength: number,
  groupLength: number,
  limits: { maxBodyLength: number; maxMentions: number; maxGroups: number }
) => {
  if (bodyLength > limits.maxBodyLength) {
    return `Message body can contain up to ${limits.maxBodyLength} characters.`;
  }
  if (mentionLength > limits.maxMentions) {
    return `Mentions can contain up to ${limits.maxMentions} items.`;
  }
  if (groupLength > limits.maxGroups) {
    return `Ack groups can contain up to ${limits.maxGroups} items.`;
  }
  return undefined;
};

export const MentionComposer = ({
  body,
  onBodyChange,
  mentions,
  onMentionsChange,
  groups,
  onGroupsChange,
  requiredUsers = [],
  requiredGroups = [],
  requiredRoles = [],
  dueAt,
  onDueAtChange,
  attachments,
  selectedPreviewId,
  onAddFiles,
  onRetryAttachment,
  onRemoveAttachment,
  onSelectPreview,
  fetchCandidates,
  onSubmit,
  onCancel,
  placeholder = 'Write a message...',
  mentionPlaceholder = 'Search mention target (user/group/role)',
  groupPlaceholder = 'Search ack group',
  submitLabel = 'Send',
  cancelLabel = 'Cancel',
  requiredSectionLabel = 'Required targets',
  limits,
  disabled = false,
  readOnly = false,
  className,
}: MentionComposerProps) => {
  const [mentionQuery, setMentionQuery] = useState('');
  const [groupQuery, setGroupQuery] = useState('');
  const [mentionCandidates, setMentionCandidates] = useState<MentionTarget[]>([]);
  const [groupCandidates, setGroupCandidates] = useState<MentionTarget[]>([]);
  const [mentionActiveIndex, setMentionActiveIndex] = useState(0);
  const [groupActiveIndex, setGroupActiveIndex] = useState(0);
  const [mentionLoading, setMentionLoading] = useState(false);
  const [groupLoading, setGroupLoading] = useState(false);
  const [interactionMessage, setInteractionMessage] = useState<string | undefined>(undefined);

  const mentionInputId = useId();
  const groupInputId = useId();
  const bodyInputId = useId();
  const dueInputId = useId();

  const resolvedLimits = useMemo(
    () => ({
      ...DEFAULT_MENTION_COMPOSER_LIMITS,
      ...limits,
    }),
    [limits]
  );

  const canEdit = !(disabled || readOnly);
  const mentionKeySet = useMemo(() => new Set(mentions.map((target) => toTargetKey(target))), [mentions]);
  const groupKeySet = useMemo(() => new Set(groups.map((target) => toTargetKey(target))), [groups]);

  const mentionMaxReached = mentions.length >= resolvedLimits.maxMentions;
  const groupMaxReached = groups.length >= resolvedLimits.maxGroups;

  useEffect(() => {
    const query = mentionQuery.trim();
    if (!query || !canEdit) {
      setMentionCandidates([]);
      setMentionLoading(false);
      return;
    }

    let cancelled = false;
    setMentionLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const [users, candidateGroups, roles] = await Promise.all([
          fetchCandidates(query, 'user'),
          fetchCandidates(query, 'group'),
          fetchCandidates(query, 'role'),
        ]);

        if (cancelled) {
          return;
        }

        const merged = mergeUniqueTargets([
          ...users,
          ...candidateGroups,
          ...roles,
        ]);
        setMentionCandidates(
          filterByQuery(merged, query).filter((candidate) => !mentionKeySet.has(toTargetKey(candidate)))
        );
        setMentionActiveIndex(0);
      } catch (unknownError) {
        if (!cancelled) {
          setMentionCandidates([]);
          setInteractionMessage('Failed to load mention candidates.');
        }
      } finally {
        if (!cancelled) {
          setMentionLoading(false);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [canEdit, fetchCandidates, mentionKeySet, mentionQuery]);

  useEffect(() => {
    const query = groupQuery.trim();
    if (!query || !canEdit) {
      setGroupCandidates([]);
      setGroupLoading(false);
      return;
    }

    let cancelled = false;
    setGroupLoading(true);
    const timer = window.setTimeout(async () => {
      try {
        const foundGroups = await fetchCandidates(query, 'group');
        if (cancelled) {
          return;
        }

        setGroupCandidates(
          filterByQuery(foundGroups, query).filter((candidate) => !groupKeySet.has(toTargetKey(candidate)))
        );
        setGroupActiveIndex(0);
      } catch (unknownError) {
        if (!cancelled) {
          setGroupCandidates([]);
          setInteractionMessage('Failed to load group candidates.');
        }
      } finally {
        if (!cancelled) {
          setGroupLoading(false);
        }
      }
    }, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [canEdit, fetchCandidates, groupKeySet, groupQuery]);

  const constraintError = pickConstraintError(
    body.length,
    mentions.length,
    groups.length,
    resolvedLimits
  );
  const resolvedMessage = constraintError ?? interactionMessage;

  const addMention = (target: MentionTarget) => {
    if (!canEdit) {
      return;
    }
    if (mentionMaxReached) {
      setInteractionMessage(`Mentions can contain up to ${resolvedLimits.maxMentions} items.`);
      return;
    }
    if (mentionKeySet.has(toTargetKey(target))) {
      return;
    }
    onMentionsChange([...mentions, target]);
    setMentionQuery('');
    setMentionCandidates([]);
    setInteractionMessage(undefined);
  };

  const addGroup = (target: MentionTarget) => {
    if (!canEdit) {
      return;
    }
    if (groupMaxReached) {
      setInteractionMessage(`Ack groups can contain up to ${resolvedLimits.maxGroups} items.`);
      return;
    }
    if (groupKeySet.has(toTargetKey(target))) {
      return;
    }
    onGroupsChange([...groups, target]);
    setGroupQuery('');
    setGroupCandidates([]);
    setInteractionMessage(undefined);
  };

  const removeMention = (target: MentionTarget) => {
    if (!canEdit) {
      return;
    }
    onMentionsChange(mentions.filter((item) => toTargetKey(item) !== toTargetKey(target)));
  };

  const removeGroup = (target: MentionTarget) => {
    if (!canEdit) {
      return;
    }
    onGroupsChange(groups.filter((item) => toTargetKey(item) !== toTargetKey(target)));
  };

  const handleSubmit = () => {
    if (!canEdit || resolvedMessage || body.trim().length === 0) {
      return;
    }
    onSubmit();
  };

  const showMentionList = canEdit && mentionQuery.trim().length > 0;
  const showGroupList = canEdit && groupQuery.trim().length > 0;
  const mentionActiveDescendant =
    showMentionList && mentionCandidates.length > 0
      ? `${mentionInputId}-option-${mentionActiveIndex}`
      : undefined;
  const groupActiveDescendant =
    showGroupList && groupCandidates.length > 0
      ? `${groupInputId}-option-${groupActiveIndex}`
      : undefined;

  return (
    <section
      className={clsx(
        'itdo-mention-composer',
        {
          'itdo-mention-composer--disabled': disabled,
          'itdo-mention-composer--readonly': !disabled && readOnly,
          'itdo-mention-composer--error': Boolean(resolvedMessage),
        },
        className
      )}
    >
      <div className="itdo-mention-composer__field">
        <label htmlFor={bodyInputId}>Message</label>
        <textarea
          id={bodyInputId}
          value={body}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-describedby={`${bodyInputId}-limit`}
          onChange={(event) => {
            setInteractionMessage(undefined);
            onBodyChange(event.currentTarget.value);
          }}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />
        <p id={`${bodyInputId}-limit`} className="itdo-mention-composer__limit">
          {body.length}/{resolvedLimits.maxBodyLength}
        </p>
      </div>

      <div className="itdo-mention-composer__picker-grid">
        <div className="itdo-mention-composer__field">
          <label htmlFor={mentionInputId}>Mentions</label>
          <input
            id={mentionInputId}
            type="text"
            role="combobox"
            value={mentionQuery}
            placeholder={mentionPlaceholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-expanded={showMentionList}
            aria-controls={`${mentionInputId}-listbox`}
            aria-activedescendant={mentionActiveDescendant}
            onChange={(event) => {
              setInteractionMessage(undefined);
              setMentionQuery(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (!showMentionList || mentionCandidates.length === 0) {
                return;
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setMentionActiveIndex((previous) => (previous + 1) % mentionCandidates.length);
                return;
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setMentionActiveIndex(
                  (previous) => (previous - 1 + mentionCandidates.length) % mentionCandidates.length
                );
                return;
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                addMention(mentionCandidates[mentionActiveIndex]);
                return;
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                setMentionQuery('');
                setMentionCandidates([]);
              }
            }}
          />
          {showMentionList && (
            <ul
              id={`${mentionInputId}-listbox`}
              className="itdo-mention-composer__listbox"
              role="listbox"
              aria-label="Mention candidates"
            >
              {mentionLoading && <li className="itdo-mention-composer__status">Loading...</li>}
              {!mentionLoading && mentionCandidates.length === 0 && (
                <li className="itdo-mention-composer__status">No candidate found.</li>
              )}
              {!mentionLoading &&
                mentionCandidates.map((candidate, index) => (
                  <li key={toTargetKey(candidate)}>
                    <button
                      id={`${mentionInputId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === mentionActiveIndex}
                      className={clsx('itdo-mention-composer__option', {
                        'is-active': index === mentionActiveIndex,
                      })}
                      disabled={mentionMaxReached}
                      onMouseEnter={() => setMentionActiveIndex(index)}
                      onClick={() => addMention(candidate)}
                    >
                      <span>{candidate.label}</span>
                      <span className="itdo-mention-composer__kind">{candidate.kind}</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
          {mentions.length > 0 && (
            <ul className="itdo-mention-composer__tokens" aria-label="Selected mentions">
              {mentions.map((target) => (
                <li key={toTargetKey(target)} className="itdo-mention-composer__token">
                  <span>{target.label}</span>
                  <span className="itdo-mention-composer__kind">{target.kind}</span>
                  <button
                    type="button"
                    aria-label={`Remove mention ${target.label}`}
                    disabled={!canEdit}
                    onClick={() => removeMention(target)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="itdo-mention-composer__field">
          <label htmlFor={groupInputId}>Ack groups</label>
          <input
            id={groupInputId}
            type="text"
            role="combobox"
            value={groupQuery}
            placeholder={groupPlaceholder}
            disabled={disabled}
            readOnly={readOnly}
            aria-expanded={showGroupList}
            aria-controls={`${groupInputId}-listbox`}
            aria-activedescendant={groupActiveDescendant}
            onChange={(event) => {
              setInteractionMessage(undefined);
              setGroupQuery(event.currentTarget.value);
            }}
            onKeyDown={(event) => {
              if (!showGroupList || groupCandidates.length === 0) {
                return;
              }
              if (event.key === 'ArrowDown') {
                event.preventDefault();
                setGroupActiveIndex((previous) => (previous + 1) % groupCandidates.length);
                return;
              }
              if (event.key === 'ArrowUp') {
                event.preventDefault();
                setGroupActiveIndex(
                  (previous) => (previous - 1 + groupCandidates.length) % groupCandidates.length
                );
                return;
              }
              if (event.key === 'Enter') {
                event.preventDefault();
                addGroup(groupCandidates[groupActiveIndex]);
                return;
              }
              if (event.key === 'Escape') {
                event.preventDefault();
                setGroupQuery('');
                setGroupCandidates([]);
              }
            }}
          />
          {showGroupList && (
            <ul
              id={`${groupInputId}-listbox`}
              className="itdo-mention-composer__listbox"
              role="listbox"
              aria-label="Ack group candidates"
            >
              {groupLoading && <li className="itdo-mention-composer__status">Loading...</li>}
              {!groupLoading && groupCandidates.length === 0 && (
                <li className="itdo-mention-composer__status">No candidate found.</li>
              )}
              {!groupLoading &&
                groupCandidates.map((candidate, index) => (
                  <li key={toTargetKey(candidate)}>
                    <button
                      id={`${groupInputId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={index === groupActiveIndex}
                      className={clsx('itdo-mention-composer__option', {
                        'is-active': index === groupActiveIndex,
                      })}
                      disabled={groupMaxReached}
                      onMouseEnter={() => setGroupActiveIndex(index)}
                      onClick={() => addGroup(candidate)}
                    >
                      <span>{candidate.label}</span>
                      <span className="itdo-mention-composer__kind">{candidate.kind}</span>
                    </button>
                  </li>
                ))}
            </ul>
          )}
          {groups.length > 0 && (
            <ul className="itdo-mention-composer__tokens" aria-label="Selected ack groups">
              {groups.map((target) => (
                <li key={toTargetKey(target)} className="itdo-mention-composer__token">
                  <span>{target.label}</span>
                  <span className="itdo-mention-composer__kind">{target.kind}</span>
                  <button
                    type="button"
                    aria-label={`Remove ack group ${target.label}`}
                    disabled={!canEdit}
                    onClick={() => removeGroup(target)}
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {(requiredUsers.length > 0 || requiredGroups.length > 0 || requiredRoles.length > 0) && (
        <section className="itdo-mention-composer__required" aria-label={requiredSectionLabel}>
          <h4>{requiredSectionLabel}</h4>
          <ul>
            {requiredUsers.map((target) => (
              <li key={toTargetKey(target)}>
                <span>{target.label}</span>
                <span className="itdo-mention-composer__kind">user</span>
              </li>
            ))}
            {requiredGroups.map((target) => (
              <li key={toTargetKey(target)}>
                <span>{target.label}</span>
                <span className="itdo-mention-composer__kind">group</span>
              </li>
            ))}
            {requiredRoles.map((target) => (
              <li key={toTargetKey(target)}>
                <span>{target.label}</span>
                <span className="itdo-mention-composer__kind">role</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(dueAt !== undefined || onDueAtChange) && (
        <div className="itdo-mention-composer__field">
          <label htmlFor={dueInputId}>Due at</label>
          <input
            id={dueInputId}
            type="datetime-local"
            value={dueAt ?? ''}
            disabled={disabled}
            readOnly={readOnly}
            onChange={(event) => onDueAtChange?.(event.currentTarget.value || undefined)}
          />
        </div>
      )}

      {attachments && (
        <AttachmentField
          attachments={attachments}
          selectedPreviewId={selectedPreviewId}
          onAddFiles={canEdit ? onAddFiles : undefined}
          onRetryAttachment={canEdit ? onRetryAttachment : undefined}
          onRemoveAttachment={canEdit ? onRemoveAttachment : undefined}
          onSelectPreview={canEdit ? onSelectPreview : undefined}
        />
      )}

      {resolvedMessage && (
        <p className="itdo-mention-composer__message" role="alert">
          {resolvedMessage}
        </p>
      )}

      <div className="itdo-mention-composer__actions">
        {onCancel && (
          <button type="button" className="itdo-mention-composer__cancel" onClick={onCancel}>
            {cancelLabel}
          </button>
        )}
        <button
          type="button"
          className="itdo-mention-composer__submit"
          onClick={handleSubmit}
          disabled={!canEdit || Boolean(resolvedMessage) || body.trim().length === 0}
        >
          {submitLabel}
        </button>
      </div>
    </section>
  );
};
