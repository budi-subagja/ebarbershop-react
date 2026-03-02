const BASE_URL = "https://script.google.com/macros/s/AKfycbyWXV1AcEYiLBlS8ipZDmMEAMe7tdSzXEC-lsMK2ZFFXW8ry5JTfDExDWPOlUxQAw9jMA/exec";

// --- Fungsi Login ---
export async function loginAPI({ username, password }) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "login",
        payload: { nama: username, pin: password }
      }),
    });
    if (!response.ok) throw new Error("Gagal terhubung ke server");
    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
}

// --- Fungsi Ambil Menu Layanan untuk POS ---
export async function getLayananAPI(cabangId) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        action: "getLayanan",
        payload: { cabangId: cabangId }
      }),
    });
    return await response.json();
  } catch (error) {
    console.error("Fetch Layanan Error:", error);
    return { success: false, message: "Gagal terhubung ke server" };
  }
}

// --- Fungsi Simpan Transaksi POS ---
export async function saveTransactionPOS(payload) {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" }, // tetap konsisten dengan GAS kamu
      body: JSON.stringify({
        action: "saveTransactionPOS",
        payload: payload
      }),
    });

    if (!response.ok) throw new Error("Gagal menyimpan transaksi");

    return await response.json();

  } catch (error) {
    console.error("Save Transaction Error:", error);
    return { success: false, message: "Server error" };
  }
}

export async function getCapsterAPI(cabangId) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({
      action: "getCapster",
      payload: { cabangId }
    }),
  });

  return await response.json();
}