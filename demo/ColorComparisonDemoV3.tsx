import React, { useState } from 'react';
import '../src/styles/global.css';

const ColorComparisonDemoV3 = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // 改良版の配色1（ブルー中心、オレンジは差し色）
  const blueColors = {
    name: 'ブルー案',
    subtitle: 'プロフェッショナル',
    primary: '#1e40af',
    primaryHover: '#1e3a8a',
    accent: '#f97316',
    text: '#111827',
    background: '#ffffff',
    border: '#e5e7eb',
  };

  // 改良版の配色2（ブラウン中心、オレンジは差し色）
  const brownColors = {
    name: 'ブラウン案',
    subtitle: '温かみのある配色',
    primary: '#8b6f47',
    primaryHover: '#78522b',
    primaryLight: '#a18072',
    accent: '#f97316',
    text: '#3e2723',
    background: '#fdf8f6',
    border: '#e0cec7',
  };

  // 改良版の配色3（濃いブラウン中心、オレンジは差し色）
  const brownDarkColors = {
    name: 'ブラウン濃',
    subtitle: '落ち着きと信頼感',
    primary: '#6b4423',
    primaryHover: '#5a3a1f',
    primaryLight: '#8b5a3c',
    accent: '#f97316',
    text: '#2e1e11',
    background: '#faf5f0',
    border: '#d4b192',
  };

  const ComparisonSection = ({ title, subtitle, colors, isImproved = false, colorScheme = 'blue' }: any) => {
    const styles = {
      container: {
        padding: '1.5rem',
        backgroundColor: colors.background,
        borderRadius: '0.75rem',
        border: `1px solid ${colors.border}`,
        flex: 1,
        minHeight: '600px',
      },
      headerWrapper: {
        marginBottom: '1.5rem',
      },
      header: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        marginBottom: '0.25rem',
        color: colors.text,
        borderBottom: isImproved ? `3px solid ${colors.accent}` : 'none',
        paddingBottom: '0.5rem',
      },
      subtitle: {
        fontSize: '0.875rem',
        color: colorScheme.includes('brown') ? colors.primaryLight || '#8b6f47' : '#6b7280',
        fontWeight: '500',
      },
      button: {
        padding: '0.625rem 1.25rem',
        backgroundColor: colors.primary,
        color: 'white',
        border: 'none',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '0.75rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s',
        ...(isImproved && {
          borderLeft: `3px solid ${colors.accent}`,
        }),
      },
      buttonSecondary: {
        padding: '0.625rem 1.25rem',
        backgroundColor: 'transparent',
        color: colors.primary,
        border: `2px solid ${colors.primary}`,
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        marginRight: '0.75rem',
        marginBottom: '0.75rem',
        transition: 'all 0.2s',
      },
      card: {
        padding: '1rem',
        backgroundColor: colorScheme.includes('brown') ? '#ffffff' : 'white',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.5rem',
        marginBottom: '0.75rem',
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
        gap: '0.5rem',
        marginBottom: '1.5rem',
        borderBottom: `1px solid ${colors.border}`,
        paddingBottom: '0',
      },
      navItem: {
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        color: colors.text,
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.875rem',
        borderBottom: '3px solid transparent',
        transition: 'all 0.2s',
      },
      navItemActive: {
        color: isImproved ? colors.primary : colors.primary,
        borderBottomColor: isImproved ? colors.accent : colors.primary,
        backgroundColor: isImproved 
          ? (colorScheme === 'brownDark' ? '#fff7ed' : '#fff7ed')
          : '#fff7ed',
      },
      badge: {
        display: 'inline-block',
        padding: '0.25rem 0.625rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: '500',
        backgroundColor: isImproved 
          ? (colorScheme === 'blue' ? '#dbeafe' : colorScheme === 'brown' ? '#fdf8f6' : '#faf5f0')
          : '#fff7ed',
        color: isImproved ? colors.primary : colors.primary,
        border: isImproved ? `1px solid ${colors.accent}` : 'none',
      },
      input: {
        width: '100%',
        padding: '0.625rem',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        outline: 'none',
        transition: 'all 0.2s',
        backgroundColor: colorScheme.includes('brown') ? '#ffffff' : 'white',
      },
      inputFocus: {
        borderColor: isImproved ? colors.primary : colors.primary,
        boxShadow: isImproved 
          ? (colorScheme === 'blue' 
            ? `0 0 0 3px rgba(30, 64, 175, 0.1)`
            : colorScheme === 'brown'
            ? `0 0 0 3px rgba(139, 111, 71, 0.1)`
            : `0 0 0 3px rgba(107, 68, 35, 0.1)`)
          : `0 0 0 3px rgba(249, 115, 22, 0.2)`,
      },
      alert: {
        padding: '0.75rem',
        backgroundColor: '#fff7ed',
        border: `1px solid ${isImproved ? colors.accent : colors.primary}`,
        borderLeft: `3px solid ${isImproved ? colors.accent : colors.primary}`,
        borderRadius: '0.375rem',
        marginBottom: '0.75rem',
        fontSize: '0.875rem',
      },
      logo: {
        fontSize: '1.125rem',
        fontWeight: 'bold',
        color: isImproved ? colors.accent : colors.primary,
        marginBottom: '0.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
      },
      stats: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '0.75rem',
        marginBottom: '1.5rem',
      },
      statCard: {
        padding: '0.75rem',
        backgroundColor: colorScheme.includes('brown') ? '#ffffff' : 'white',
        border: `1px solid ${colors.border}`,
        borderRadius: '0.375rem',
        textAlign: 'center',
        ...(isImproved && {
          borderTop: `2px solid ${colors.accent}`,
        }),
      },
      statValue: {
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: isImproved ? colors.primary : colors.primary,
        marginBottom: '0.125rem',
      },
      statLabel: {
        fontSize: '0.75rem',
        color: colorScheme === 'brownDark' ? '#8b5a3c' : colorScheme === 'brown' ? '#a18072' : '#6b7280',
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.headerWrapper}>
          <h2 style={styles.header}>{title}</h2>
          <div style={styles.subtitle}>{subtitle}</div>
        </div>
        
        {/* ロゴ */}
        <div style={styles.logo}>
          <span style={{ 
            width: '24px', 
            height: '24px', 
            backgroundColor: isImproved ? colors.accent : colors.primary,
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
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: colors.text }}>Buttons</h3>
          <div>
            <button 
              style={styles.button}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.primaryHover;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.primary;
              }}
            >
              Primary
            </button>
            <button style={styles.buttonSecondary}>Secondary</button>
            <button 
              style={{ 
                ...styles.button, 
                backgroundColor: '#6b7280',
                borderLeft: isImproved ? `3px solid ${colors.accent}` : 'none',
              }}
            >
              Default
            </button>
          </div>
        </div>

        {/* インプット */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem', color: colors.text }}>Input</h3>
          <input 
            type="text" 
            placeholder="メールアドレスを入力..." 
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
          <strong>お知らせ:</strong> 新機能が追加されました
        </div>

        {/* 統計カード */}
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <div style={styles.statValue}>247</div>
            <div style={styles.statLabel}>アクティブ</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statValue}>98.5%</div>
            <div style={styles.statLabel}>稼働率</div>
          </div>
        </div>

        {/* カード */}
        <div
          style={{
            ...styles.card,
            ...(selectedCard === (colorScheme === 'blue' ? 1 : colorScheme === 'brown' ? 2 : 3) && styles.cardHover),
          }}
          onClick={() => setSelectedCard(colorScheme === 'blue' ? 1 : colorScheme === 'brown' ? 2 : 3)}
          onMouseEnter={(e) => {
            Object.assign(e.currentTarget.style, styles.cardHover);
          }}
          onMouseLeave={(e) => {
            if (selectedCard !== (colorScheme === 'blue' ? 1 : colorScheme === 'brown' ? 2 : 3)) {
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
        >
          <h4 style={{ marginTop: 0, fontSize: '0.875rem', fontWeight: '600', color: colors.text }}>インタラクティブカード</h4>
          <p style={{ color: colorScheme === 'brownDark' ? '#8b5a3c' : colorScheme === 'brown' ? '#a18072' : '#6b7280', marginBottom: '0.75rem', fontSize: '0.813rem' }}>
            ホバーと選択状態のデモ
          </p>
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <span style={styles.badge}>Active</span>
            <span style={{ ...styles.badge, backgroundColor: '#dcfce7', color: '#22c55e', border: 'none' }}>Online</span>
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
          marginBottom: '0.75rem',
          color: '#111827',
        }}>
          配色改良案の比較
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          marginBottom: '2rem',
          fontSize: '1rem',
        }}>
          ブルー案とブラウン案（標準・濃いめ）の3案比較
        </p>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(3, 1fr)', 
          gap: '1.5rem',
          marginBottom: '2rem',
        }}>
          <ComparisonSection 
            title={blueColors.name}
            subtitle={blueColors.subtitle}
            colors={blueColors}
            isImproved={true}
            colorScheme="blue"
          />
          <ComparisonSection 
            title={brownColors.name}
            subtitle={brownColors.subtitle}
            colors={brownColors}
            isImproved={true}
            colorScheme="brown"
          />
          <ComparisonSection 
            title={brownDarkColors.name}
            subtitle={brownDarkColors.subtitle}
            colors={brownDarkColors}
            isImproved={true}
            colorScheme="brownDark"
          />
        </div>

        {/* 配色の詳細比較 */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          border: '1px solid #e5e7eb',
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
            配色案の特徴比較
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#1e40af',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.5rem',
              }}>
                ブルー案
              </h3>
              <ul style={{ color: '#6b7280', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
                <li>プロフェッショナルで信頼感</li>
                <li>オレンジとの補色関係で調和</li>
                <li>長時間使用でも疲れにくい</li>
                <li>B2B・エンタープライズ向け</li>
              </ul>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#8b6f47',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.5rem',
              }}>
                ブラウン案（標準）
              </h3>
              <ul style={{ color: '#6b7280', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
                <li>温かみと親しみやすさ</li>
                <li>柔らかい印象で目に優しい</li>
                <li>オレンジとの相性が自然</li>
                <li>B2C・コミュニティ向け</li>
              </ul>
            </div>
            <div>
              <h3 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                marginBottom: '0.5rem',
                color: '#6b4423',
                borderLeft: '3px solid #f97316',
                paddingLeft: '0.5rem',
              }}>
                ブラウン案（濃いめ）
              </h3>
              <ul style={{ color: '#6b7280', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
                <li>落ち着きと重厚感</li>
                <li>高級感のある印象</li>
                <li>コントラストが明確</li>
                <li>プレミアム・専門サービス向け</li>
              </ul>
            </div>
          </div>

          {/* カラーパレット表示 */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              カラーパレット
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {/* ブルー案 */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>ブルー案</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#1e40af', borderRadius: '0.25rem' }} title="Primary" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f97316', borderRadius: '0.25rem' }} title="Accent" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#111827', borderRadius: '0.25rem' }} title="Text" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '0.25rem' }} title="Background" />
                </div>
              </div>
              {/* ブラウン案 */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>ブラウン案</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#8b6f47', borderRadius: '0.25rem' }} title="Primary" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f97316', borderRadius: '0.25rem' }} title="Accent" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#3e2723', borderRadius: '0.25rem' }} title="Text" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#fdf8f6', border: '1px solid #e0cec7', borderRadius: '0.25rem' }} title="Background" />
                </div>
              </div>
              {/* ブラウン濃 */}
              <div>
                <div style={{ fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>ブラウン濃</div>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#6b4423', borderRadius: '0.25rem' }} title="Primary" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#f97316', borderRadius: '0.25rem' }} title="Accent" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#2e1e11', borderRadius: '0.25rem' }} title="Text" />
                  <div style={{ width: '40px', height: '40px', backgroundColor: '#faf5f0', border: '1px solid #d4b192', borderRadius: '0.25rem' }} title="Background" />
                </div>
              </div>
            </div>
          </div>

          {/* 使用シーン */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
              推奨使用シーン
            </h3>
            <table style={{ width: '100%', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ padding: '0.5rem', textAlign: 'left', fontWeight: '600' }}>用途</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#1e40af' }}>ブルー</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#8b6f47' }}>ブラウン</th>
                  <th style={{ padding: '0.5rem', textAlign: 'center', color: '#6b4423' }}>ブラウン濃</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '0.5rem' }}>エンタープライズ</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>○</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                </tr>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '0.5rem' }}>コミュニティ</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>○</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>△</td>
                </tr>
                <tr>
                  <td style={{ padding: '0.5rem' }}>プレミアム</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>○</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>△</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                </tr>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <td style={{ padding: '0.5rem' }}>長時間使用</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>◎</td>
                  <td style={{ padding: '0.5rem', textAlign: 'center' }}>○</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorComparisonDemoV3;