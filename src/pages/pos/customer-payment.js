import React, { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppSettings } from "../../config/app-settings.js";
import { saveTransactionPOS } from "../../config/api";
import { useAuth } from "../../context/authContext.jsx";

function CustomerPayment() {
    const location = useLocation();
    const navigate = useNavigate();
    const context = useContext(AppSettings);
    const { user } = useAuth();

    useEffect(() => {
    // Mode POS (tanpa header & sidebar dashboard)
    context.handleSetAppHeaderNone(true);
    context.handleSetAppSidebarNone(true);
    context.handleSetAppContentFullHeight(true);
    context.handleSetAppContentClass("p-0");

    return () => {
        // Kembalikan normal saat keluar halaman
        context.handleSetAppHeaderNone(false);
        context.handleSetAppSidebarNone(false);
        context.handleSetAppContentFullHeight(false);
        context.handleSetAppContentClass("");
    };
    }, [context]);

    // Redirect jika tidak ada data (misalnya refresh)
    useEffect(() => {
        if (!location.state) {
        navigate("/pos/customer-order");
        }
    }, [location, navigate]);

    const { orderData = [], total = 0 } = location.state || {};
    const totalAmount = parseFloat(total);

    const paymentMethods = ["Tunai", "QRIS", "Transfer", "Debit"];

    const [payments, setPayments] = useState([
        { method: "", amount: "" }
    ]);

    const handleAddSplit = () => {
        setPayments([...payments, { method: "", amount: "" }]);
    };

    const handleRemoveSplit = (index) => {
        const newPayments = payments.filter((_, i) => i !== index);
        setPayments(newPayments);
    };

    const handleChange = (index, field, value) => {
        const newPayments = [...payments];
        newPayments[index][field] = value;
        setPayments(newPayments);
    };

    const getTotalPaid = () => {
        return payments.reduce((sum, p) => {
        return sum + parseFloat(p.amount || 0);
        }, 0);
    };

    const totalPaid = getTotalPaid();
    const remaining = totalAmount - totalPaid;
    const change = totalPaid > totalAmount ? totalPaid - totalAmount : 0;

const handleSubmit = async () => {
  try {
    if (remaining > 0) {
      alert("Pembayaran kurang!");
      return;
    }

    if (payments.some(p => !p.method || !p.amount)) {
      alert("Metode dan nominal harus diisi!");
      return;
    }

    const payload = {
        userId: user.id,
        cabangId: user.cabangId,
        items: orderData,
        payments: payments
    };

    const result = await saveTransactionPOS(payload);

    if (result.success) {
      alert("Pembayaran berhasil!\nInvoice: " + result.invoice);
      navigate("/pos/customer-order");
    } else {
      alert(result.message);
    }

  } catch (error) {
    console.error(error);
    alert("Terjadi kesalahan saat menyimpan transaksi");
  }
};

    return (
    <div className="container-fluid py-4">
        <div className="row">

        {/* ================= LEFT SIDE - ORDER SUMMARY ================= */}
        <div className="col-lg-6 mb-4">
            <div className="card h-100 shadow-sm">
            <div className="card-body">
                <h4 className="mb-3">Ringkasan Pesanan</h4>

                <div className="mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                {orderData.map((item, i) => (
                    <div key={i} className="d-flex justify-content-between mb-2">
                    <div>
                        {item.title} x {item.quantity}
                    </div>
                    <strong>
                        Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </strong>
                    </div>
                ))}
                </div>

                <hr />

                <div className="d-flex justify-content-between">
                <h5>Total</h5>
                <h4 className="text-theme">
                    Rp {totalAmount.toLocaleString("id-ID")}
                </h4>
                </div>
            </div>
            </div>
        </div>

        {/* ================= RIGHT SIDE - PAYMENT ================= */}
        <div className="col-lg-6">
            <div className="card shadow-sm">
            <div className="card-body">
                <h4 className="mb-3">Pembayaran</h4>

                {payments.map((p, index) => (
                <div key={index} className="border rounded p-3 mb-3">

                    <div className="row">
                    <div className="col-md-6 mb-2">
                        <label className="form-label">Metode</label>
                        <select
                        className="form-select"
                        value={p.method}
                        onChange={(e) =>
                            handleChange(index, "method", e.target.value)
                        }
                        >
                        <option value="">Pilih Metode</option>
                        {paymentMethods.map((m, i) => (
                            <option key={i} value={m}>{m}</option>
                        ))}
                        </select>
                    </div>

                    <div className="col-md-6 mb-2">
                        <label className="form-label">Nominal</label>
                        <input
                        type="number"
                        className="form-control"
                        value={p.amount}
                        onChange={(e) =>
                            handleChange(index, "amount", e.target.value)
                        }
                        />
                    </div>
                    </div>

                    {/* QUICK AMOUNT BUTTONS */}
                    <div className="mt-2 d-flex flex-wrap gap-2">
                    {[10000, 20000, 50000, 100000].map((val, i) => (
                        <button
                        key={i}
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            handleChange(index, "amount", val)
                        }
                        >
                        {val.toLocaleString("id-ID")}
                        </button>
                    ))}

                    <button
                        type="button"
                        className="btn btn-outline-success btn-sm"
                        onClick={() =>
                        handleChange(index, "amount", totalAmount)
                        }
                    >
                        UANG PAS
                    </button>
                    </div>

                    {payments.length > 1 && (
                    <button
                        className="btn btn-sm btn-danger mt-3"
                        onClick={() => handleRemoveSplit(index)}
                    >
                        Hapus Split
                    </button>
                    )}
                </div>
                ))}

                <button
                className="btn btn-secondary mb-3"
                onClick={handleAddSplit}
                >
                + Tambah Split
                </button>

                <hr />

                {/* PAYMENT SUMMARY */}
                <div className="mb-2 d-flex justify-content-between">
                <span>Total Dibayar</span>
                <strong>Rp {totalPaid.toLocaleString("id-ID")}</strong>
                </div>

                <div className="mb-2 d-flex justify-content-between">
                <span>Sisa</span>
                <strong className={remaining > 0 ? "text-danger" : "text-success"}>
                    Rp {remaining.toLocaleString("id-ID")}
                </strong>
                </div>

                {change > 0 && (
                <div className="mb-3 d-flex justify-content-between">
                    <span>Kembalian</span>
                    <strong className="text-success">
                    Rp {change.toLocaleString("id-ID")}
                    </strong>
                </div>
                )}

                <button
                className="btn btn-theme btn-lg w-100 fw-bold"
                disabled={remaining > 0}
                onClick={handleSubmit}
                >
                BAYAR SEKARANG
                </button>

            </div>
            </div>
        </div>

        </div>
    </div>
    );

}

export default CustomerPayment;