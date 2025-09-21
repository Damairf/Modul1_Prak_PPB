import { supabase } from "../config/supabaseClient.js";

export const MedicationModel = {
async getAll(page = 1, limit = 3, search = "") {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from("medications")
      .select("id, sku, name, description, price, quantity, category_id, supplier_id");

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data, error } = await query.range(from, to);
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("medications")
      .select(
        `
        id, sku, name, description, price, quantity,
        categories ( id, name ),
        suppliers ( id, name, email, phone ),
      `
      )
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  },

  async create(payload) {
    if (
      payload.price == null ||
      payload.quantity == null ||
      payload.price <= 0 ||
      payload.quantity <= 0
    ) {
      throw new Error("Harga dan jumlah stok harus diisi dan lebih dari 0!");
    }

    const { data, error } = await supabase
      .from("medications")
      .insert([payload])
      .select();
    if (error) throw error;
    return data[0];
  },

  async update(id, payload) {
    const { data, error } = await supabase
      .from("medications")
      .update(payload)
      .eq("id", id)
      .select();
    if (error) throw error;
    return data[0];
  },

  async remove(id) {
    const { error } = await supabase.from("medications").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  },

  async getTotal() {
    const { data, error } = await supabase
      .from("medications")
      .select("quantity");
    if (error) throw error;

    const total = data.reduce((sum, item) => sum + item.quantity, 0);
    return total;
  },
};