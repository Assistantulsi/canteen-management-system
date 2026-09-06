/**
 * CampusBite - React AdminOrderBoard Component
 * Executive live order management console with real-time status transitions,
 * search, filters, and printable Kitchen Order Ticket (KOT) modal.
 */

function AdminOrderBoard() {
  const [orders, setOrders] = React.useState([]);
  const [selectedStatus, setSelectedStatus] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [activeKotOrder, setActiveKotOrder] = React.useState(null);

  // Load orders
  const loadOrders = async () => {
    setLoading(true);
    const res = await API.getOrders();
    if (res.success) setOrders(res.data);
    setLoading(false);
  };

  React.useEffect(() => {
    loadOrders();
  }, []);

  // Filtered orders
  const filteredOrders = React.useMemo(() => {
    return orders.filter((o) => {
      if (selectedStatus !== "All" && o.orderStatus !== selectedStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.orderId.toLowerCase().includes(q);
        const matchName = o.studentName.toLowerCase().includes(q);
        const matchToken = o.tokenNumber.toLowerCase().includes(q);
        if (!matchId && !matchName && !matchToken) return false;
      }
      return true;
    });
  }, [orders, selectedStatus, searchQuery]);

  // Handle status update
  const handleStatusChange = async (orderId, newStatus) => {
    const res = await API.updateOrderStatus(orderId, newStatus);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, orderStatus: newStatus } : o))
      );
      Utils.showToast(`Order ${orderId} status set to ${newStatus}`, "success");
    }
  };

  const statusOptions = ["Pending", "Confirmed", "Preparing", "Ready", "Completed", "Cancelled"];

  return (
    <div className="admin-order-board">
      {/* Top Filter & Search Controls */}
      <div className="admin-board-controls">
        <div className="board-search-box">
          <i className="fa-solid fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            placeholder="Search Order ID, Token #, Student Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="admin-status-tabs">
          {["All", ...statusOptions].map((status) => {
            const count = status === "All" ? orders.length : orders.filter((o) => o.orderStatus === status).length;
            return (
              <button
                key={status}
                className={`status-tab-btn ${selectedStatus === status ? "active" : ""}`}
                onClick={() => setSelectedStatus(status)}
              >
                <span>{status}</span>
                <span className="tab-badge">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="p-5 text-center">
          <i className="fa-solid fa-spinner fa-spin fa-2x"></i>
          <p className="mt-2">Loading orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="card p-5 text-center">
          <i className="fa-solid fa-clipboard-check fa-2x text-muted mb-2"></i>
          <h4>No orders matching criteria</h4>
          <p className="text-muted">No orders found under "{selectedStatus}" status.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Token & ID</th>
                <th>Student Details</th>
                <th>Items Ordered</th>
                <th>Amount</th>
                <th>Counter / Slot</th>
                <th>Live Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.orderId}>
                  {/* Token & ID */}
                  <td>
                    <span className="admin-token-badge">#{order.tokenNumber}</span>
                    <strong className="d-block mt-1 font-mono text-xs">{order.orderId}</strong>
                    <small className="text-muted">{Utils.formatDate(order.orderTime)}</small>
                  </td>

                  {/* Student Details */}
                  <td>
                    <strong>{order.studentName}</strong>
                    <span className="d-block text-muted text-xs">{order.studentId}</span>
                    <span className="d-block text-muted text-xs">{order.studentPhone}</span>
                  </td>

                  {/* Items Ordered */}
                  <td>
                    <ul className="admin-items-mini-list">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="item-qty">{item.quantity}x</span>
                          <span className="item-name">{item.name}</span>
                        </li>
                      ))}
                    </ul>
                    {order.specialNotes && (
                      <div className="admin-item-note">
                        <i className="fa-regular fa-note-sticky"></i> "{order.specialNotes}"
                      </div>
                    )}
                  </td>

                  {/* Amount & Payment */}
                  <td>
                    <strong className="text-primary font-bold">₹{order.totalAmount}</strong>
                    <span className="d-block text-xs text-muted">{order.paymentMethod}</span>
                    <span className="badge-status status-ready text-xs mt-1">Paid</span>
                  </td>

                  {/* Counter & Slot */}
                  <td>
                    <span className="font-semibold text-xs d-block">{order.pickupCounter}</span>
                    <small className="text-muted">{order.pickupSlot || "Immediate"}</small>
                  </td>

                  {/* Live Status Dropdown */}
                  <td>
                    <select
                      className={`order-status-select status-${order.orderStatus.toLowerCase()}`}
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                    >
                      {statusOptions.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>

                  {/* Action Buttons */}
                  <td>
                    <div className="action-btns-group">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setActiveKotOrder(order)}
                        title="Print Kitchen Order Ticket (KOT)"
                      >
                        <i className="fa-solid fa-print"></i> KOT
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Printable Kitchen Order Ticket Modal */}
      {activeKotOrder && (
        <div className="modal-backdrop show" onClick={() => setActiveKotOrder(null)}>
          <div className="modal-dialog kot-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveKotOrder(null)}>&times;</button>
            <div className="kot-ticket" id="printable-kot">
              <div className="kot-header">
                <h3>CAMPUS CANTEEN KITCHEN</h3>
                <p>KITCHEN ORDER TICKET (KOT)</p>
                <div className="kot-token">#{activeKotOrder.tokenNumber}</div>
                <p><strong>{activeKotOrder.pickupCounter}</strong></p>
                <small>Order ID: {activeKotOrder.orderId}</small><br />
                <small>Time: {Utils.formatDate(activeKotOrder.orderTime)}</small>
              </div>

              <div className="kot-student-info">
                <span>Student: {activeKotOrder.studentName} ({activeKotOrder.studentId})</span>
              </div>

              <table className="kot-items-table">
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>QTY</th>
                    <th style={{ textAlign: "left" }}>ITEM NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {activeKotOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: "bold", width: "40px" }}>{it.quantity}x</td>
                      <td>{it.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {activeKotOrder.specialNotes && (
                <div style={{ margin: "8px 0", borderTop: "1px dashed #999", paddingTop: "4px" }}>
                  <strong>SPECIAL INSTRUCTION:</strong><br />
                  <em>{activeKotOrder.specialNotes}</em>
                </div>
              )}

              <div className="kot-footer">
                <p>--- CANTEEN DISPATCH COPY ---</p>
              </div>

              <div className="mt-3 no-print" style={{ display: "flex", gap: "8px" }}>
                <button
                  className="btn btn-primary btn-block"
                  onClick={() => window.print()}
                >
                  <i className="fa-solid fa-print"></i> Print Ticket
                </button>
                <button
                  className="btn btn-secondary btn-block"
                  onClick={() => setActiveKotOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Expose component to window
window.AdminOrderBoard = AdminOrderBoard;
