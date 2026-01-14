import React, { useState } from 'react';
import { themeColors } from '../src/tokens/theme-colors';
import '../src/styles/global.css';

const HybridThemeDemo = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<'hybrid' | 'brown' | 'blue'>('hybrid');
  
  // テーマ設定を取得
  const getActiveTheme = () => {
    if (selectedTheme === 'hybrid') {
      // ハイブリッド: ライトはブラウン、ダークはブルー
      return isDarkMode ? themeColors.blue.dark : themeColors.brown.light;
    } else if (selectedTheme === 'brown') {
      return isDarkMode ? themeColors.brown.dark : themeColors.brown.light;
    } else {
      return isDarkMode ? themeColors.blue.dark : themeColors.blue.light;
    }
  };

  const theme = getActiveTheme();

  const themeOptions: { value: 'hybrid' | 'brown' | 'blue'; label: string; desc: string }[] = [
    { value: 'hybrid', label: '🎨 ハイブリッド', desc: 'ライト=ブラウン / ダーク=ブルー' },
    { value: 'brown', label: '🟫 ブラウン', desc: '一貫したブラウン' },
    { value: 'blue', label: '🔵 ブルー', desc: '一貫したブルー' },
  ];

  const MainInterface = () => {
    const styles = {
      container: {
        minHeight: '600px',
        backgroundColor: theme.background.default,
        color: theme.text.primary,
        padding: '1.5rem',
        borderRadius: '0.75rem',
        transition: 'all 0.3s ease',
      },
      header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: `2px solid ${theme.accent.main}`,
      },
      logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '1.25rem',
        fontWeight: 'bold',
        color: theme.accent.main,
      },
      nav: {
        display: 'flex',
        gap: '1rem',
        marginBottom: '1.5rem',
      },
      navItem: {
        padding: '0.5rem 1rem',
        backgroundColor: theme.background.paper,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.375rem',
        color: theme.text.secondary,
        cursor: 'pointer',
        transition: 'all 0.2s',
      },
      navItemActive: {
        backgroundColor: theme.primary.main,
        color: isDarkMode ? theme.background.default : '#ffffff',
        borderColor: theme.primary.main,
      },
      card: {
        backgroundColor: theme.background.paper,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.5rem',
        padding: '1.25rem',
        marginBottom: '1rem',
      },
      button: {
        padding: '0.625rem 1.25rem',
        backgroundColor: theme.primary.main,
        color: isDarkMode ? theme.background.default : '#ffffff',
        border: 'none',
        borderRadius: '0.375rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        cursor: 'pointer',
        transition: 'all 0.2s',
        borderLeft: `3px solid ${theme.accent.main}`,
      },
      stat: {
        textAlign: 'center' as const,
        padding: '1rem',
        backgroundColor: theme.background.paper,
        border: `1px solid ${theme.border.default}`,
        borderRadius: '0.375rem',
        borderTop: `3px solid ${theme.accent.main}`,
      },
    };

    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <span style={{
              width: '28px',
              height: '28px',
              backgroundColor: theme.accent.main,
              borderRadius: '0.375rem',
              display: 'block',
            }} />
            <span>ITDO System</span>
          </div>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: theme.background.subtle,
              border: `1px solid ${theme.border.default}`,
              borderRadius: '0.375rem',
              color: theme.text.primary,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            {isDarkMode ? '🌙' : '☀️'}
            {isDarkMode ? 'ダーク' : 'ライト'}
          </button>
        </div>

        <div style={styles.nav}>
          {['Dashboard', 'Analytics', 'Reports'].map((item, idx) => (
            <div
              key={item}
              style={{
                ...styles.navItem,
                ...(idx === 0 ? styles.navItemActive : {}),
              }}
            >
              {item}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={styles.stat}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary.main }}>1,234</div>
            <div style={{ fontSize: '0.875rem', color: theme.text.secondary }}>ユーザー</div>
          </div>
          <div style={styles.stat}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary.main }}>98.5%</div>
            <div style={{ fontSize: '0.875rem', color: theme.text.secondary }}>稼働率</div>
          </div>
          <div style={styles.stat}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: theme.primary.main }}>456</div>
            <div style={{ fontSize: '0.875rem', color: theme.text.secondary }}>タスク</div>
          </div>
        </div>

        <div style={styles.card}>
          <h3 style={{ marginTop: 0, color: theme.text.primary }}>サンプルコンテンツ</h3>
          <p style={{ color: theme.text.secondary, marginBottom: '1rem' }}>
            {selectedTheme === 'hybrid' 
              ? 'ハイブリッドテーマ: 日中は温かみのあるブラウン、夜間はクールなブルーに自動切り替え'
              : selectedTheme === 'brown'
              ? 'ブラウンテーマ: 一貫して温かみのある配色'
              : 'ブルーテーマ: 一貫してプロフェッショナルな配色'}
          </p>
          <button style={styles.button}>アクション実行</button>
        </div>
      </div>
    );
  };

  const AnalysisSection = () => {
    const analysisStyle = {
      section: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginBottom: '1.5rem',
      },
      grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
      },
      pros: {
        padding: '1rem',
        backgroundColor: '#dcfce7',
        borderRadius: '0.375rem',
        borderLeft: '4px solid #22c55e',
      },
      cons: {
        padding: '1rem',
        backgroundColor: '#fef2f2',
        borderRadius: '0.375rem',
        borderLeft: '4px solid #ef4444',
      },
      consideration: {
        padding: '1rem',
        backgroundColor: '#dbeafe',
        borderRadius: '0.375rem',
        borderLeft: '4px solid #3b82f6',
        marginTop: '1rem',
      },
    };

    return (
      <div style={analysisStyle.section}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          ハイブリッドテーマ分析
        </h2>
        
        <div style={analysisStyle.grid}>
          <div style={analysisStyle.pros}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#15803d', marginBottom: '0.5rem' }}>
              ✅ メリット
            </h3>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>日中は温かみ、夜間は集中力向上</li>
              <li>生体リズムに合わせた配色</li>
              <li>目の疲労を最小限に</li>
              <li>ユニークな体験を提供</li>
              <li>両テーマの良さを活用</li>
            </ul>
          </div>

          <div style={analysisStyle.cons}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#dc2626', marginBottom: '0.5rem' }}>
              ⚠️ 注意点
            </h3>
            <ul style={{ fontSize: '0.875rem', paddingLeft: '1.25rem', margin: 0 }}>
              <li>切り替え時の違和感</li>
              <li>ブランドの一貫性</li>
              <li>学習コストの増加</li>
              <li>デザインの複雑化</li>
            </ul>
          </div>
        </div>

        <div style={analysisStyle.consideration}>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#1d4ed8', marginBottom: '0.5rem' }}>
            💡 実装時の工夫
          </h3>
          <div style={{ fontSize: '0.875rem' }}>
            <strong>解決策：</strong>
            <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem' }}>
              <li><strong>トランジション：</strong> スムーズな切り替えアニメーション（0.3秒）</li>
              <li><strong>一貫性の維持：</strong> オレンジのアクセントカラーを共通使用</li>
              <li><strong>ユーザー設定：</strong> 手動切り替えオプションを提供</li>
              <li><strong>プリセット：</strong> 「自動」「常にライト」「常にダーク」の3モード</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  const ComparisonTable = () => {
    const tableStyle = {
      container: {
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.5rem',
      },
      table: {
        width: '100%',
        fontSize: '0.875rem',
        borderCollapse: 'collapse' as const,
      },
      th: {
        padding: '0.75rem',
        textAlign: 'left' as const,
        borderBottom: '2px solid #e5e7eb',
        fontWeight: '600',
      },
      td: {
        padding: '0.75rem',
        borderBottom: '1px solid #f3f4f6',
      },
      highlight: {
        backgroundColor: '#fff7ed',
        fontWeight: '600',
      },
    };

    return (
      <div style={tableStyle.container}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          テーマ比較表
        </h2>
        <table style={tableStyle.table}>
          <thead>
            <tr>
              <th style={tableStyle.th}>項目</th>
              <th style={tableStyle.th}>ハイブリッド</th>
              <th style={tableStyle.th}>ブラウン単独</th>
              <th style={tableStyle.th}>ブルー単独</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tableStyle.td}>日中の視認性</td>
              <td style={{ ...tableStyle.td, ...tableStyle.highlight }}>◎ 最適</td>
              <td style={tableStyle.td}>◎ 良好</td>
              <td style={tableStyle.td}>○ 標準</td>
            </tr>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td style={tableStyle.td}>夜間の視認性</td>
              <td style={{ ...tableStyle.td, ...tableStyle.highlight }}>◎ 最適</td>
              <td style={tableStyle.td}>○ 標準</td>
              <td style={tableStyle.td}>◎ 良好</td>
            </tr>
            <tr>
              <td style={tableStyle.td}>ブランド一貫性</td>
              <td style={tableStyle.td}>△ 変化あり</td>
              <td style={{ ...tableStyle.td }}>◎ 一貫</td>
              <td style={tableStyle.td}>◎ 一貫</td>
            </tr>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              <td style={tableStyle.td}>ユーザー体験</td>
              <td style={{ ...tableStyle.td, ...tableStyle.highlight }}>◎ 革新的</td>
              <td style={tableStyle.td}>○ 安定</td>
              <td style={tableStyle.td}>○ 安定</td>
            </tr>
            <tr>
              <td style={tableStyle.td}>実装の複雑さ</td>
              <td style={tableStyle.td}>△ やや複雑</td>
              <td style={tableStyle.td}>◎ シンプル</td>
              <td style={tableStyle.td}>◎ シンプル</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div style={{ padding: '1.5rem', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '0.5rem',
          color: '#111827',
        }}>
          ハイブリッドテーマ検証
        </h1>
        <p style={{ 
          textAlign: 'center', 
          color: '#6b7280', 
          marginBottom: '2rem',
        }}>
          ブラウンライト × ブルーダーク の組み合わせ
        </p>

        {/* テーマ選択 */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          {themeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedTheme(option.value)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: selectedTheme === option.value ? '#f97316' : 'white',
                color: selectedTheme === option.value ? 'white' : '#374151',
                border: `2px solid ${selectedTheme === option.value ? '#f97316' : '#e5e7eb'}`,
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ fontSize: '1rem', fontWeight: '600' }}>{option.label}</div>
              <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{option.desc}</div>
            </button>
          ))}
        </div>

        {/* メインインターフェース */}
        <MainInterface />

        {/* 分析セクション */}
        <div style={{ marginTop: '2rem' }}>
          <AnalysisSection />
          <ComparisonTable />
        </div>

        {/* 推奨事項 */}
        <div style={{ 
          backgroundColor: '#fff7ed', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          border: '2px solid #f97316',
          marginTop: '1.5rem',
        }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#9a3412', marginBottom: '0.5rem' }}>
            🎯 推奨実装方法
          </h3>
          <p style={{ fontSize: '0.875rem', color: '#78522b', marginBottom: '0.5rem' }}>
            <strong>基本設定：</strong> デフォルトはハイブリッドモード（自動切り替え）
          </p>
          <ul style={{ fontSize: '0.875rem', color: '#78522b', paddingLeft: '1.25rem' }}>
            <li>朝6時〜夕方18時: ブラウンライト（温かみのある業務環境）</li>
            <li>夕方18時〜朝6時: ブルーダーク（集中力を高める環境）</li>
            <li>ユーザー設定で固定モードも選択可能</li>
            <li>切り替え時は3秒のスムーズなトランジション</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HybridThemeDemo;
