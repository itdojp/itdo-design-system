import React, { useState, useEffect } from 'react';

// Design System Demo based on ITDO Design Guide
const ITDODesignSystemDemo = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New Order', message: 'Order #12345 received', time: '2 min ago', read: false },
    { id: 2, title: 'System Update', message: 'Maintenance completed', time: '1 hour ago', read: true },
    { id: 3, title: 'Payment Alert', message: 'Invoice payment overdue', time: '3 hours ago', read: false }
  ]);
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);

  // Sample data
  const dashboardStats = [
    { title: 'Total Revenue', value: '¥12,847,000', change: '+12.5%', changeType: 'positive', icon: '💰' },
    { title: 'Active Orders', value: '247', change: '+8', changeType: 'positive', icon: '📦' },
    { title: 'Customer Satisfaction', value: '4.8/5', change: '+0.2', changeType: 'positive', icon: '⭐' },
    { title: 'Support Tickets', value: '23', change: '+5', changeType: 'negative', icon: '🎫' }
  ];

  const salesData = [
    { month: 'Jan', value: 45000 },
    { month: 'Feb', value: 52000 },
    { month: 'Mar', value: 48000 },
    { month: 'Apr', value: 61000 },
    { month: 'May', value: 55000 },
    { month: 'Jun', value: 67000 }
  ];

  const employeeData = [
    { id: 1, name: 'John Smith', department: 'Engineering', role: 'Senior Developer', status: 'Active', joinDate: '2023-01-15' },
    { id: 2, name: 'Sarah Johnson', department: 'Marketing', role: 'Marketing Manager', status: 'Active', joinDate: '2022-11-08' },
    { id: 3, name: 'Mike Chen', department: 'Sales', role: 'Sales Representative', status: 'Leave', joinDate: '2023-03-22' },
    { id: 4, name: 'Emily Davis', department: 'HR', role: 'HR Specialist', status: 'Active', joinDate: '2022-07-12' },
    { id: 5, name: 'David Wilson', department: 'Finance', role: 'Financial Analyst', status: 'Active', joinDate: '2023-02-01' }
  ];

  const recentActivities = [
    { type: 'order', user: 'ABC Corporation', action: 'placed new order', amount: '¥285,000', time: '5 min ago' },
    { type: 'payment', user: 'XYZ Limited', action: 'payment received', amount: '¥150,000', time: '15 min ago' },
    { type: 'support', user: 'Customer Support', action: 'ticket resolved', amount: '#T-456', time: '1 hour ago' },
    { type: 'inventory', user: 'System', action: 'low stock alert', amount: 'Product A-001', time: '2 hours ago' }
  ];

  // Design tokens
  const tokens = {
    colors: {
      primary: { 500: '#f97316', 100: '#fff7ed', 600: '#ea580c' },
      neutral: { 50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 600: '#525252', 800: '#262626' },
      semantic: { success: '#22c55e', warning: '#eab308', error: '#ef4444', info: '#3b82f6' }
    },
    spacing: { 2: '0.5rem', 3: '0.75rem', 4: '1rem', 6: '1.5rem', 8: '2rem' }
  };

  // Simple Chart Component
  const LineChart = ({ data, width = 300, height = 150 }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const points = data.map((d, i) => {
      const x = (i / (data.length - 1)) * (width - 40) + 20;
      const y = height - 30 - ((d.value / maxValue) * (height - 60));
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width={width} height={height} style={{ overflow: 'visible' }}>
        <polyline
          fill="none"
          stroke={tokens.colors.primary[500]}
          strokeWidth="3"
          points={points}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 40) + 20;
          const y = height - 30 - ((d.value / maxValue) * (height - 60));
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill={tokens.colors.primary[500]}
              stroke="white"
              strokeWidth="2"
            />
          );
        })}
      </svg>
    );
  };

  // Components styled according to design guide
  const styles = {
    // Layout
    container: {
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      backgroundColor: darkMode ? '#1a1a1a' : '#fafafa',
      color: darkMode ? '#f5f5f5' : '#262626',
      minHeight: '100vh',
      display: 'grid',
      gridTemplateColumns: sidebarCollapsed ? '64px 1fr' : '280px 1fr',
      transition: 'all 0.3s ease'
    },

    // Sidebar
    sidebar: {
      backgroundColor: darkMode ? '#262626' : 'white',
      borderRight: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    sidebarHeader: {
      padding: '1rem',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    logo: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: tokens.colors.primary[500]
    },
    toggleBtn: {
      background: 'none',
      border: 'none',
      padding: '0.5rem',
      borderRadius: '0.375rem',
      cursor: 'pointer',
      fontSize: '1.125rem',
      color: darkMode ? '#a3a3a3' : '#525252'
    },

    // Navigation
    navItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      color: darkMode ? '#d4d4d4' : '#525252',
      textDecoration: 'none',
      transition: 'all 0.2s ease',
      borderRight: '3px solid transparent',
      cursor: 'pointer'
    },
    navItemActive: {
      backgroundColor: darkMode ? '#404040' : tokens.colors.primary[100],
      color: tokens.colors.primary[500],
      borderRightColor: tokens.colors.primary[500]
    },
    navIcon: {
      fontSize: '1rem',
      width: '1rem',
      textAlign: 'center'
    },

    // Main Content
    main: {
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    topBar: {
      height: '64px',
      backgroundColor: darkMode ? '#262626' : 'white',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    },
    searchBox: {
      position: 'relative',
      width: '300px'
    },
    searchInput: {
      width: '100%',
      height: '40px',
      padding: '0 2.5rem 0 0.75rem',
      border: `1px solid ${darkMode ? '#404040' : '#d4d4d4'}`,
      borderRadius: '20px',
      backgroundColor: darkMode ? '#404040' : '#f5f5f5',
      color: darkMode ? '#f5f5f5' : '#262626',
      outline: 'none',
      fontSize: '0.875rem'
    },
    searchIcon: {
      position: 'absolute',
      right: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: darkMode ? '#737373' : '#a3a3a3'
    },

    // Buttons
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: '0.375rem',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none'
    },
    btnPrimary: {
      backgroundColor: tokens.colors.primary[500],
      color: 'white'
    },
    btnGhost: {
      backgroundColor: 'transparent',
      color: darkMode ? '#d4d4d4' : '#525252'
    },

    // Cards
    card: {
      backgroundColor: darkMode ? '#262626' : 'white',
      border: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      borderRadius: '0.5rem',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden'
    },
    cardHeader: {
      padding: '1rem 1.5rem',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      backgroundColor: darkMode ? '#1a1a1a' : '#fafafa'
    },
    cardContent: {
      padding: '1.5rem'
    },
    cardTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      margin: 0,
      color: darkMode ? '#f5f5f5' : '#262626'
    },

    // Stats
    statCard: {
      textAlign: 'center'
    },
    statValue: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: tokens.colors.primary[500],
      marginBottom: '0.5rem'
    },
    statLabel: {
      fontSize: '0.875rem',
      color: darkMode ? '#a3a3a3' : '#525252',
      marginBottom: '0.5rem'
    },
    statChange: (type) => ({
      fontSize: '0.875rem',
      color: type === 'positive' ? tokens.colors.semantic.success : tokens.colors.semantic.error,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.25rem'
    }),

    // Table
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: darkMode ? '#1a1a1a' : '#fafafa',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`
    },
    th: {
      padding: '0.75rem 1rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: darkMode ? '#d4d4d4' : '#404040'
    },
    td: {
      padding: '0.75rem 1rem',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      fontSize: '0.875rem'
    },

    // Status Badge
    badge: (type) => ({
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: type === 'Active' ? 
        tokens.colors.semantic.success + '20' : 
        tokens.colors.semantic.warning + '20',
      color: type === 'Active' ? tokens.colors.semantic.success : tokens.colors.semantic.warning
    }),

    // Content area
    contentArea: {
      flex: 1,
      overflow: 'auto',
      padding: '1.5rem'
    },

    // Grid layouts
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem',
      marginBottom: '2rem'
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem',
      marginBottom: '2rem'
    },

    // Alert
    alert: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      borderRadius: '0.375rem',
      backgroundColor: tokens.colors.semantic.info + '15',
      border: `1px solid ${tokens.colors.semantic.info}30`,
      color: '#1e40af',
      marginBottom: '1rem'
    },
    alertIcon: {
      fontSize: '1rem',
      marginTop: '0.125rem'
    },
    alertClose: {
      background: 'none',
      border: 'none',
      marginLeft: 'auto',
      cursor: 'pointer',
      fontSize: '1.125rem',
      opacity: 0.7
    },

    // Modal
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modal: {
      backgroundColor: darkMode ? '#262626' : 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      width: '90%',
      maxWidth: '500px'
    },
    modalHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.5rem',
      borderBottom: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`
    },
    modalTitle: {
      fontSize: '1.125rem',
      fontWeight: '600',
      margin: 0
    },
    modalClose: {
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      padding: '0.25rem',
      borderRadius: '0.25rem'
    },
    modalBody: {
      padding: '1.5rem'
    },
    modalFooter: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.75rem',
      padding: '1rem 1.5rem',
      borderTop: `1px solid ${darkMode ? '#404040' : '#e5e5e5'}`,
      backgroundColor: darkMode ? '#1a1a1a' : '#fafafa'
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', active: true },
    { id: 'sales', label: 'Sales', icon: '💰', active: false },
    { id: 'inventory', label: 'Inventory', icon: '📦', active: false },
    { id: 'hr', label: 'Human Resources', icon: '👥', active: false },
    { id: 'finance', label: 'Finance', icon: '📈', active: false },
    { id: 'reports', label: 'Reports', icon: '📊', active: false },
    { id: 'settings', label: 'Settings', icon: '⚙️', active: false }
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          {!sidebarCollapsed && <div style={styles.logo}>ITDO ERP</div>}
          <button 
            style={styles.toggleBtn}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {menuItems.map(item => (
            <div
              key={item.id}
              style={{
                ...styles.navItem,
                ...(item.active ? styles.navItemActive : {})
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Top Bar */}
        <header style={styles.topBar}>
          <div style={styles.searchBox}>
            <input 
              type="search" 
              placeholder="Search anything..." 
              style={styles.searchInput}
            />
            <span style={styles.searchIcon}>🔍</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              style={{ ...styles.btn, ...styles.btnGhost }}
              onClick={() => setDarkMode(!darkMode)}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div style={{ position: 'relative' }}>
              <button style={{ ...styles.btn, ...styles.btnGhost }}>
                🔔
                {notifications.filter(n => !n.read).length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-4px',
                    right: '-4px',
                    backgroundColor: tokens.colors.semantic.error,
                    color: 'white',
                    borderRadius: '50%',
                    width: '18px',
                    height: '18px',
                    fontSize: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {notifications.filter(n => !n.read).length}
                  </span>
                )}
              </button>
            </div>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: tokens.colors.primary[500],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '0.875rem',
              fontWeight: '600'
            }}>
              KO
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div style={styles.contentArea}>
          {alertVisible && (
            <div style={styles.alert}>
              <span style={styles.alertIcon}>ℹ️</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>System Update Available</div>
                <div>New features are available in this version. Click here to learn more.</div>
              </div>
              <button 
                style={styles.alertClose}
                onClick={() => setAlertVisible(false)}
              >
                ×
              </button>
            </div>
          )}

          <h1 style={{ 
            fontSize: '2.25rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: darkMode ? '#f5f5f5' : '#262626'
          }}>
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div style={styles.statsGrid}>
            {dashboardStats.map((stat, index) => (
              <div key={index} style={styles.card}>
                <div style={{ ...styles.cardContent, ...styles.statCard }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={styles.statLabel}>{stat.title}</div>
                      <div style={styles.statValue}>{stat.value}</div>
                      <div style={styles.statChange(stat.changeType)}>
                        <span>{stat.changeType === 'positive' ? '↑' : '↓'}</span>
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: '1.5rem', opacity: 0.7 }}>{stat.icon}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Content */}
          <div style={styles.dashboardGrid}>
            {/* Sales Chart */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Sales Trend</h3>
              </div>
              <div style={styles.cardContent}>
                <LineChart data={salesData} width={400} height={200} />
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  marginTop: '1rem',
                  fontSize: '0.875rem',
                  color: darkMode ? '#a3a3a3' : '#525252'
                }}>
                  {salesData.map(d => (
                    <span key={d.month}>{d.month}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.cardTitle}>Recent Activities</h3>
              </div>
              <div style={{ padding: '1rem 0' }}>
                {recentActivities.map((activity, index) => (
                  <div key={index} style={{
                    padding: '0.75rem 1.5rem',
                    borderBottom: index < recentActivities.length - 1 ? 
                      `1px solid ${darkMode ? '#404040' : '#e5e5e5'}` : 'none'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: 
                          activity.type === 'order' ? tokens.colors.semantic.success :
                          activity.type === 'payment' ? tokens.colors.primary[500] :
                          activity.type === 'support' ? tokens.colors.semantic.info :
                          tokens.colors.semantic.warning
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: darkMode ? '#f5f5f5' : '#262626',
                          marginBottom: '0.25rem'
                        }}>
                          <strong>{activity.user}</strong> {activity.action}
                        </div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: darkMode ? '#a3a3a3' : '#525252'
                        }}>
                          {activity.amount} • {activity.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h3 style={styles.cardTitle}>Employee Management</h3>
              <button 
                style={{ ...styles.btn, ...styles.btnPrimary }}
                onClick={() => setModalOpen(true)}
              >
                Add Employee
              </button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.th}>Name</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Join Date</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {employeeData.map(employee => (
                    <tr key={employee.id}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            backgroundColor: tokens.colors.primary[500],
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '0.875rem',
                            fontWeight: '600'
                          }}>
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span>{employee.name}</span>
                        </div>
                      </td>
                      <td style={styles.td}>{employee.department}</td>
                      <td style={styles.td}>{employee.role}</td>
                      <td style={styles.td}>
                        <span style={styles.badge(employee.status)}>
                          {employee.status}
                        </span>
                      </td>
                      <td style={styles.td}>{employee.joinDate}</td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            border: `1px solid ${darkMode ? '#404040' : '#d4d4d4'}`,
                            borderRadius: '0.25rem',
                            backgroundColor: 'transparent',
                            color: darkMode ? '#d4d4d4' : '#525252',
                            cursor: 'pointer'
                          }}>
                            Edit
                          </button>
                          <button style={{
                            padding: '0.25rem 0.5rem',
                            fontSize: '0.75rem',
                            border: `1px solid ${tokens.colors.semantic.error}`,
                            borderRadius: '0.25rem',
                            backgroundColor: 'transparent',
                            color: tokens.colors.semantic.error,
                            cursor: 'pointer'
                          }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {modalOpen && (
        <div style={styles.modalOverlay} onClick={() => setModalOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Add New Employee</h2>
              <button 
                style={styles.modalClose}
                onClick={() => setModalOpen(false)}
              >
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: darkMode ? '#d4d4d4' : '#404040'
                  }}>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter employee name..."
                    style={{
                      width: '100%',
                      height: '40px',
                      padding: '0 0.75rem',
                      border: `1px solid ${darkMode ? '#404040' : '#d4d4d4'}`,
                      borderRadius: '0.375rem',
                      backgroundColor: darkMode ? '#404040' : 'white',
                      color: darkMode ? '#f5f5f5' : '#262626',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{
                    display: 'block',
                    marginBottom: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: darkMode ? '#d4d4d4' : '#404040'
                  }}>
                    Department
                  </label>
                  <select style={{
                    width: '100%',
                    height: '40px',
                    padding: '0 0.75rem',
                    border: `1px solid ${darkMode ? '#404040' : '#d4d4d4'}`,
                    borderRadius: '0.375rem',
                    backgroundColor: darkMode ? '#404040' : 'white',
                    color: darkMode ? '#f5f5f5' : '#262626',
                    outline: 'none'
                  }}>
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Sales</option>
                    <option>HR</option>
                    <option>Finance</option>
                  </select>
                </div>
              </div>
            </div>
            <div style={styles.modalFooter}>
              <button 
                style={{ ...styles.btn, ...styles.btnGhost }}
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>
              <button style={{ ...styles.btn, ...styles.btnPrimary }}>
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITDODesignSystemDemo;