import React, { useState } from 'react';
import { getTheme } from '../src/tokens/theme-colors';
import '../src/styles/global.css';

const ThemeComparisonDemo = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  type Theme = ReturnType<typeof getTheme>;
  type ThemeSectionProps = {
    color: 'brown' | 'blue';
    mode: 'light' | 'dark';
    theme: Theme;
  };

  const themes = [
    { color: 'brown', mode: 'light', theme: getTheme('brown', 'light') },
    { color: 'brown', mode: 'dark', theme: getTheme('brown', 'dark') },
    { color: 'blue', mode: 'light', theme: getTheme('blue', 'light') },
    { color: 'blue', mode: 'dark', theme: getTheme('blue', 'dark') },
  ];

  const ThemeSection = ({ color, mode, theme }: ThemeSectionProps) => {
    const isDark = mode === 'dark';
    const isBrown = color === 'brown';
    const themeId = `${color}-${mode}`;

    const styles = {
      container: {
        padding: '1.25rem',
        backgroundColor: theme.background.default,
        borderRadius: '0.75rem',
        border: `1px solid ${theme.border.default}`,
        minHeight: '650px',
      },
      headerWrapper: {
        marginBottom: '1.25rem',
        borderBottom: `2px solid ${theme.accent.main}`,
        paddingBottom: '0.75rem',
      },
      header: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        marginBottom: '0.25rem',
        color: theme.text.primary,
      },
      subtitle: {
        fontSize: '0.813rem',
        color: theme.text.secondary,
        fontWeight: '500',
      },
      modeIndicator: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.375rem',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        backgroundColor: isDark ? theme.background.subtle : theme.background.subtle,
        fontSize: '0.75rem',
        fontWeight: '500',
        color: theme.text.secondary,
        marginTop: '0.5rem',
      },
      button: {
        padding: '0.5rem 1rem',
        backgroundColor: theme.primary.main,
        color: isDark ? theme.background.default : '#ffffff',
        border: 'none',
        borderRadius: '0.375rem',
        fontSize: '0.813rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
        borderLeft: `3px solid ${theme.accent.main}`,
      },
      buttonSecondary: {
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: theme.primary.main,
        border: `2px solid ${theme.primary.main}`,
        borderRadius: '0.375rem',
        fontSize: '0.813rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '0.5rem',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
      },
      buttonGhost: {
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: theme.text.secondary,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.375rem',
        fontSize: '0.813rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginBottom: '0.5rem',
        transition: 'all 0.2s',
      },
      card: {
        padding: '0.875rem',
        backgroundColor: theme.background.paper,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.5rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
      },
      cardHover: {
        borderColor: theme.accent.main,
        boxShadow: `0 0 0 1px ${theme.accent.main}, 0 4px 6px ${theme.accent.main}20`,
      },
      logo: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: theme.accent.main,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
      nav: {
        display: 'flex',
        gap: '0.375rem',
        marginBottom: '1.25rem',
        borderBottom: `1px solid ${theme.border.default}`,
        paddingBottom: '0',
      },
      navItem: {
        padding: '0.375rem 0.75rem',
        backgroundColor: 'transparent',
        color: theme.text.secondary,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.75rem',
        borderBottom: '2px solid transparent',
        transition: 'all 0.2s',
      },
      navItemActive: {
        color: theme.primary.main,
        borderBottomColor: theme.accent.main,
        backgroundColor: theme.background.subtle,
      },
      input: {
        width: '100%',
        padding: '0.5rem',
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.375rem',
        fontSize: '0.813rem',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: theme.background.paper,
        color: theme.text.primary,
      },
      badge: {
        display: 'inline-block',
        padding: '0.125rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.688rem',
        fontWeight: '500',
        marginRight: '0.25rem',
      },
      badgeDefault: {
        backgroundColor: theme.background.subtle,
        color: theme.text.secondary,
        border: `1px solid ${theme.border.light}`,
      },
      badgeAccent: {
        backgroundColor: `${theme.accent.main}20`,
        color: theme.accent.main,
        border: `1px solid ${theme.accent.main}40`,
      },
      badgeSuccess: {
        backgroundColor: `${theme.status.success}20`,
        color: isDark ? theme.status.success : '#15803d',
        border: 'none',
      },
      alert: {
        padding: '0.625rem',
        backgroundColor: `${theme.accent.main}10`,
        border: `1px solid ${theme.accent.main}40`,
        borderLeft: `3px solid ${theme.accent.main}`,
        borderRadius: '0.375rem',
        marginBottom: '0.75rem',
        fontSize: '0.75rem',
        color: theme.text.primary,
      },
      stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.5rem',
        marginBottom: '1rem',
      },
      statCard: {
        padding: '0.625rem',
        backgroundColor: theme.background.paper,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.375rem',
        textAlign: 'center',
        borderTop: `2px solid ${theme.accent.main}`,
      },
      statValue: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: theme.primary.main,
        marginBottom: '0.125rem',
      },
      statLabel: {
        fontSize: '0.688rem',
        color: theme.text.tertiary,
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.headerWrapper}>
          <h2 style={styles.header}>{theme.name}</h2>
          <div style={styles.subtitle}>
            {isBrown ? '第1案 - メインテーマ' : '第2案 - サブテーマ'}
          </div>
          <div style={styles.modeIndicator}>
            <span>{isDark ? '🌙' : '☀️'}</span>
            <span>{isDark ? 'ダークモード' : 'ライトモード'}</span>
          </div>
        </div>
        
        {/* ロゴ */}
        <div style={styles.logo}>
          <span style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: theme.accent.main,
            borderRadius: '0.25rem',
            display: 'inline-block'
          }} />
          ITDO System
        </div>

        {/* ナビゲーション */}
        <div style={styles.nav}>
          {['Overview', 'Analytics', 'Reports'].map((item) => (
            <button
              key={item}
              style={{
                ...styles.navItem,
                ...(item.toLowerCase() === activeTab && styles.navItemActive),
              }}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item}
            </button>
          ))}
        </div>

        {/* ボタン */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: theme.text.secondary }}>
            ボタン
          </div>
          <div>
            <button 
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary.hover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = theme.primary.main;
              }}
            >
              Primary
            </button>
            <button style={styles.buttonSecondary}>Secondary</button>
            <button style={styles.buttonGhost}>Ghost</button>
          </div>
        </div>

        {/* インプット */}
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: theme.text.secondary }}>
            入力フィールド
          </div>
          <input 
            type="text" 
            placeholder="メールアドレス..." 
            style={styles.input}
            onFocus={(e) => {
              e.target.style.borderColor = theme.primary.main;
              e.target.style.boxShadow = `0 0 0 3px ${theme.primary.main}20`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = theme.border.default;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* アラート */}
        <div style={styles.alert}>
          <strong>通知:</strong> 新機能が利用可能です
        </div>

        {/* 統計カード */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>247</div>
            <div style={styles.statLabel}>ユーザー</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>98%</div>
            <div style={styles.statLabel}>稼働率</div>
          </div>
        </div>

        {/* カード */}
        <div
          style={{
            ...styles.card,
            ...(selectedCard === themeId && styles.cardHover),
          }}
          onClick={() => setSelectedCard(themeId)}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseLeave={(e) => {
            if (selectedCard !== themeId) {
              e.currentTarget.style.borderColor = theme.border.default;
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <h4 style={{ marginTop: 0, fontSize: '0.813rem', fontWeight: '600', color: theme.text.primary }}>
            カードコンポーネント
          </h4>
          <p style={{ color: theme.text.secondary, marginBottom: '0.5rem', fontSize: '0.75rem' }}>
            インタラクティブ要素のデモ
          </p>
          <div>
            <span style={{ ...styles.badge, ...styles.badgeAccent }}>Active</span>
            <span style={{ ...styles.badge, ...styles.badgeSuccess }}>Online</span>
            <span style={{ ...styles.badge, ...styles.badgeDefault }}>Default</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '0.5rem',
          color: '#111827',
        }}>
          ITDO Design System - テーマ展開
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1rem',
        }}>
          ブラウン（第1案）とブルー（第2案）× ライト/ダークモード
        </p>

        {/* 4パターンのグリッド表示 */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          {themes.map(({ color, mode, theme }) => (
            <ThemeSection 
              key={`${color}-${mode}`}
              color={color}
              mode={mode}
              theme={theme}
            />
          ))}
        </div>

        {/* カラーパレット比較 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            カラーパレット比較
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
            {/* ブラウンテーマ */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#6b4423' }}>
                ブラウンテーマ（第1案）
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6b7280' }}>ライト</div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#6b4423', borderRadius: '0.25rem' }} title="Primary" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#f97316', borderRadius: '0.25rem' }} title="Accent" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#faf5f0', border: '1px solid #d4b192', borderRadius: '0.25rem' }} title="Background" />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6b7280' }}>ダーク</div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#a67449', borderRadius: '0.25rem' }} title="Primary" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#fb923c', borderRadius: '0.25rem' }} title="Accent" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#1a0f08', borderRadius: '0.25rem' }} title="Background" />
                  </div>
                </div>
              </div>
            </div>

            {/* ブルーテーマ */}
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e40af' }}>
                ブルーテーマ（第2案）
              </h3>
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6b7280' }}>ライト</div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#1e40af', borderRadius: '0.25rem' }} title="Primary" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#f97316', borderRadius: '0.25rem' }} title="Accent" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }} title="Background" />
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', marginBottom: '0.25rem', color: '#6b7280' }}>ダーク</div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#3b82f6', borderRadius: '0.25rem' }} title="Primary" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#fb923c', borderRadius: '0.25rem' }} title="Accent" />
                    <div style={{ width: '32px', height: '32px', backgroundColor: '#0f172a', borderRadius: '0.25rem' }} title="Background" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 特徴説明 */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>テーマの特徴</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', fontSize: '0.875rem' }}>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#6b4423' }}>
                  ブラウンテーマ（第1案 - メイン）
                </h4>
                <ul style={{ paddingLeft: '1.25rem', color: '#6b7280' }}>
                  <li>落ち着きと信頼感を表現</li>
                  <li>長時間使用でも目に優しい</li>
                  <li>プレミアム感のある印象</li>
                  <li>ダークモードでも温かみを維持</li>
                </ul>
              </div>
              <div>
                <h4 style={{ fontWeight: '600', marginBottom: '0.5rem', color: '#1e40af' }}>
                  ブルーテーマ（第2案）
                </h4>
                <ul style={{ paddingLeft: '1.25rem', color: '#6b7280' }}>
                  <li>プロフェッショナルな印象</li>
                  <li>情報の階層が明確</li>
                  <li>エンタープライズ向け</li>
                  <li>ダークモードでクールな印象</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeComparisonDemo;
