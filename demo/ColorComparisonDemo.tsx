import React, { useState } from 'react';
import '../src/styles/global.css';

const ColorComparisonDemo = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 現在の配色（オレンジ中心）
  const currentColors = {
    primary: '#f97316',
    primaryHover: '#ea580c',
    text: '#262626',
    background: '#fafafa',
    border: '#e5e5e5',
  };

  // 改良版の配色（ブルー中心、オレンジは差し色）
  const improvedColors = {
    primary: '#1e40af',
    primaryHover: '#1e3a8a',
    accent: '#f97316',
    text: '#111827',
    background: '#ffffff',
    border: '#e5e7eb',
  };

  const ComparisonSection = ({ title, colors, isImproved = false }: any) => {
    const styles = {
      container: {
        padding: '2rem',
        backgroundColor: colors.background,
        borderRadius: '0.5rem',
        border: `1px solid ${colors.border}`,
        flex: 1,
      },
      header: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        marginBottom: '1.5rem',
        color: colors.text,
        borderBottom: isImproved ? `3px solid ${colors.accent}` : 'none',
        paddingBottom: '0.5rem',
      },
      button: {
        padding: '0.75rem 1.5rem',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '1rem',
        marginBottom: '1rem',
        transition: 'all 0.2s',
        ...(isImproved && {
          borderLeft: `4px solid ${colors.accent}`,
        }),
      },
      buttonSecondary: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        borderRadius: '0.375rem',
        fontSize: '1rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '1rem',
        marginBottom: '1rem',
        transition: 'all 0.2s',
      },
      card: {
        padding: '1.5rem',
        backgroundColor: 'white',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        marginBottom: '1rem',
        transition: 'all 0.2s',
        cursor: 'pointer',
      },
      cardHover: {
        borderColor: isImproved ? colors.accent : colors.primary,
        boxShadow: isImproved 
          ? `0 0 0 1px ${colors.accent}, 0 4px 6px rgba(249, 115, 22, 0.1)`
          : `0 0 0 1px ${colors.primary}, 0 4px 6px rgba(249, 115, 22, 0.2)`,
      },
      nav: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '0',
      },
      navItem: {
        padding: '0.75rem 1.5rem',
        backgroundColor: 'transparent',
        color: colors.text,
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        borderBottom: '3px solid transparent',
        transition: 'all 0.2s',
      },
      navItemActive: {
        color: isImproved ? colors.primary : colors.primary,
        borderBottomColor: isImproved ? colors.accent : colors.primary,
        backgroundColor: isImproved ? '#fff7ed' : '#fff7ed',
      },
      badge: {
        display: 'inline-block',
        padding: '0.25rem 0.75rem',
        borderRadius: '9999px',
        fontSize: '0.875rem',
        fontWeight: '500',
        backgroundColor: isImproved ? '#dbeafe' : '#fff7ed',
        color: isImproved ? colors.primary : colors.primary,
        border: isImproved ? `1px solid ${colors.accent}` : 'none',
      },
      input: {
        width: '100%',
        padding: '0.75rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.375rem',
        fontSize: '1rem',
        outline: 'none',
        transition: 'all 0.2s',
      },
      inputFocus: {
        borderColor: isImproved ? colors.primary : colors.primary,
        boxShadow: isImproved 
          ? `0 0 0 3px rgba(30, 64, 175, 0.1)`
          : `0 0 0 3px rgba(249, 115, 22, 0.2)`,
      },
      alert: {
        padding: '1rem',
        backgroundColor: isImproved ? '#fff7ed' : '#fff7ed',
        border: `1px solid ${isImproved ? colors.accent : colors.primary}`,
        borderLeft: `4px solid ${isImproved ? colors.accent : colors.primary}`,
        borderRadius: '0.375rem',
        marginBottom: '1rem',
      },
      logo: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: isImproved ? colors.accent : colors.primary,
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
      stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1rem',
        marginBottom: '2rem',
      },
      statCard: {
        padding: '1rem',
        backgroundColor: 'white',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        textAlign: 'center',
        ...(isImproved && {
          borderTop: `3px solid ${colors.accent}`,
        }),
      },
      statValue: {
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: isImproved ? colors.primary : colors.primary,
        marginBottom: '0.25rem',
      },
      statLabel: {
        fontSize: '0.875rem',
        color: '#6b7280',
      },
    };

    return (
      <div style={styles.container}>
        <h2 style={styles.header}>{title}</h2>
        
        {/* ロゴ */}
        <div style={styles.logo}>
          <span style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: isImproved ? colors.accent : colors.primary,
            borderRadius: '0.25rem',
            display: 'inline-block'
          }} />
          ITDO System
        </div>

        {/* ナビゲーション */}
        <div style={styles.nav}>
          {['Overview', 'Analytics', 'Reports', 'Settings'].map((item) => (
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
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.text }}>Buttons</h3>
          <button style={styles.button}>Primary Action</button>
          <button style={styles.buttonSecondary}>Secondary Action</button>
          <button 
            style={{ 
              ...styles.button, 
              backgroundColor: '#6b7280',
              borderLeft: isImproved ? `4px solid ${colors.accent}` : 'none',
            }}
          >
            Default Button
          </button>
        </div>

        {/* インプット */}
        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: colors.text }}>Form Elements</h3>
          <input 
            type="text" 
            placeholder="Enter your email..." 
            style={styles.input}
            onFocus={(e) => {
              Object.assign(e.target.style, styles.inputFocus);
            }}
            onBlur={(e) => {
              e.target.style.borderColor = colors.border;
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        {/* アラート */}
        <div style={styles.alert}>
          <strong>Important Notice:</strong> System maintenance scheduled for tonight.
        </div>

        {/* 統計カード */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>247</div>
            <div style={styles.statLabel}>Active Users</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>98.5%</div>
            <div style={styles.statLabel}>Uptime</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>1.2k</div>
            <div style={styles.statLabel}>Transactions</div>
          </div>
        </div>

        {/* カード */}
        <div
          style={{
            ...styles.card,
            ...(selectedCard === (isImproved ? 2 : 1) && styles.cardHover),
          }}
          onClick={() => setSelectedCard(isImproved ? 2 : 1)}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseLeave={(e) => {
            if (selectedCard !== (isImproved ? 2 : 1)) {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <h4 style={{ marginTop: 0, color: colors.text }}>Interactive Card</h4>
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            This card demonstrates hover and selection states with the {isImproved ? 'improved' : 'current'} color scheme.
          </p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={styles.badge}>Active</span>
            <span style={{ ...styles.badge, backgroundColor: '#dcfce7', color: '#22c55e' }}>Online</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '1rem',
          color: '#111827',
        }}>
          配色改良の比較デモ
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          marginBottom: '3rem',
          fontSize: '1.125rem',
        }}>
          オレンジを差し色として活用した、視認性の高い新配色案
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '2rem',
          marginBottom: '3rem',
        }}>
          <ComparisonSection 
            title="現在の配色（オレンジ中心）" 
            colors={currentColors}
          />
          <ComparisonSection 
            title="改良版（ブルー × オレンジ）" 
            colors={improvedColors}
            isImproved={true}
          />
        </div>

        {/* 配色の説明 */}
        <div style={{
          backgroundColor: 'white',
          padding: '2rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            改良のポイント
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#1e40af',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.75rem',
              }}>
                視認性の向上
              </h3>
              <p style={{ color: '#6b7280' }}>
                メインUIをブルー系にすることで、長時間の使用でも目が疲れにくく、情報の階層が明確になります。
              </p>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#1e40af',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.75rem',
              }}>
                ブランドの維持
              </h3>
              <p style={{ color: '#6b7280' }}>
                オレンジ色をアクセントラインやホバー効果に使用することで、ブランドアイデンティティを保ちながら視認性を改善します。
              </p>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#1e40af',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.75rem',
              }}>
                プロフェッショナル
              </h3>
              <p style={{ color: '#6b7280' }}>
                ブルーとオレンジの補色関係により、エンタープライズ向けの信頼感と活力のバランスを実現します。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorComparisonDemo;