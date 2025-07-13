export function createFetchAPI(baseUrl) {
  return {
    async get(id = "") {
      const res = await fetch(`${baseUrl}/${id}`);
      if (!res.ok) throw new Error("Lỗi khi lấy dữ liệu");
      return await res.json();
    },
    async post(data) {
      const res = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Lỗi khi thêm dữ liệu");
      return await res.json();
    },
    async put(id, data) {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Lỗi khi cập nhật dữ liệu");
      return await res.json();
    },
    async delete(id) {
      const res = await fetch(`${baseUrl}/${id}`, {
        method: "DELETE" });
      if (!res.ok) throw new Error("Lỗi khi xóa dữ liệu");
      return true;
    },
  };
} 