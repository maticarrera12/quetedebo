import { describe, expect, it, vi } from "vitest";
import { createSharedMesaApi, parseSharedMesa, SharedMesaError } from "./sharedMesa";
import type { RpcClient } from "./sharedMesa";

const MESA = "61cc9a9a-f4b3-4615-88ce-3451987b26aa";
const ANA = "d7e417fc-2e1d-4a35-99ee-d0db34607d69";

const fakeClient = (result: { data?: unknown; error?: { message: string; code?: string } | null }) => {
  const rpc = vi.fn(async () => ({ data: result.data ?? null, error: result.error ?? null }));
  return { client: { rpc } as unknown as RpcClient, rpc };
};

describe("parseSharedMesa", () => {
  it("reads what get_mesa returns, numbers included", () => {
    const parsed = parseSharedMesa({
      id: MESA,
      name: "Asado",
      participants: [{ id: ANA, name: "Ana", expense: 100.5, concept: "la carne", color: 0 }],
    });

    expect(parsed).toEqual({
      id: MESA,
      name: "Asado",
      participants: [{ id: ANA, name: "Ana", expense: 100.5, concept: "la carne", color: 0 }],
    });
  });

  it("returns null for anything else, so a broken response never reaches the page", () => {
    expect(parseSharedMesa(null)).toBeNull();
    expect(parseSharedMesa({ id: MESA, name: "x" })).toBeNull();
    expect(parseSharedMesa({ id: MESA, name: "x", participants: [{ id: ANA, name: "", expense: 1, color: 0 }] })).toBeNull();
    expect(parseSharedMesa({ id: MESA, name: "x", participants: [{ id: ANA, name: "Ana", expense: "1", color: 0 }] })).toBeNull();
    expect(parseSharedMesa({ id: MESA, name: "x", participants: [{ name: "Ana", expense: 1, color: 0 }] })).toBeNull();
  });
});

describe("createSharedMesaApi", () => {
  it("creates a mesa seeded with the local friends and returns its id", async () => {
    const { client, rpc } = fakeClient({ data: MESA });

    const id = await createSharedMesaApi(client).create("Asado", [
      { name: "Ana", expense: 100, concept: "la carne", color: 3 },
      { name: "Beto", expense: 0 },
    ]);

    expect(id).toBe(MESA);
    expect(rpc).toHaveBeenCalledWith("create_mesa", {
      p_name: "Asado",
      p_participants: [
        { name: "Ana", expense: 100, concept: "la carne" },
        { name: "Beto", expense: 0, concept: "" },
      ],
    });
  });

  it("returns null when the mesa does not exist", async () => {
    const { client, rpc } = fakeClient({ data: null });

    expect(await createSharedMesaApi(client).get(MESA)).toBeNull();
    expect(rpc).toHaveBeenCalledWith("get_mesa", { p_mesa: MESA });
  });

  it("does not call the server for an id that is not a uuid", async () => {
    const { client, rpc } = fakeClient({ data: null });

    expect(await createSharedMesaApi(client).get("not-a-mesa")).toBeNull();
    expect(rpc).not.toHaveBeenCalled();
  });

  it("sends each edit to its function with both ids", async () => {
    const { client, rpc } = fakeClient({ data: ANA });
    const api = createSharedMesaApi(client);

    await api.add(MESA, { name: "Ana", expense: 10, concept: "vino" });
    await api.update(MESA, ANA, { name: "Ana", expense: 12, concept: "" });
    await api.remove(MESA, ANA);
    await api.rename(MESA, "Cumple");

    expect(rpc.mock.calls).toEqual([
      ["add_participant", { p_mesa: MESA, p_name: "Ana", p_expense: 10, p_concept: "vino" }],
      ["update_participant", { p_mesa: MESA, p_participant: ANA, p_name: "Ana", p_expense: 12, p_concept: "" }],
      ["delete_participant", { p_mesa: MESA, p_participant: ANA }],
      ["rename_mesa", { p_mesa: MESA, p_name: "Cumple" }],
    ]);
  });

  it("turns a server error into a SharedMesaError with a message people can read", async () => {
    const { client } = fakeClient({ error: { message: "mesa is full", code: "54000" } });

    const failure = createSharedMesaApi(client).add(MESA, { name: "Ana", expense: 1, concept: "" });

    await expect(failure).rejects.toBeInstanceOf(SharedMesaError);
    await expect(failure).rejects.toThrow("La mesa ya tiene 50 personas.");
  });
});
