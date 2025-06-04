"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import AlertMessage from "../components/alerta";
import Dialogo from "../components/dialogo";

type Missao = {
  id?: number;
  titulo: string;
  localizacao: string;
  organizacao: string;
  descricao: string;
  dataCriacaoFormata?: string;
};

type AlertType = "success" | "error";

export default function GerenciarMissao() {
  const router = useRouter();
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoMissao, setEditandoMissao] = useState<Missao | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [missaoParaDeletar, setMissaoParaDeletar] = useState<number | null>(null);

  const buscarMissoes = async () => {
    try {
      const response = await fetch("http://localhost:8080/missao/listar");
      const data = await response.json();
      setMissoes(data);
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao buscar missões" });
      setMissoes([]);
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    buscarMissoes();
    document.title = "Gerenciar Missões";
  }, [router]);

  const iniciarEdicao = (missao: Missao) => {
    setEditandoId(missao.id ?? null);
    setEditandoMissao({ ...missao });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoMissao(null);
  };

  const salvarEdicao = async () => {
    if (!editandoMissao || editandoId === null) return;

    try {
      const payload = {
        titulo: editandoMissao.titulo,
        descricao: editandoMissao.descricao,
        localizacao: editandoMissao.localizacao,
        organizacao: editandoMissao.organizacao,
      };

      const response = await fetch(`http://localhost:8080/missao/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao atualizar missão");

      const missaoAtualizada = await response.json();

      setMissoes((prev) =>
        prev.map((m) => (m.id === editandoId ? missaoAtualizada : m))
      );

      setAlert({ type: "success", message: "Missão atualizada com sucesso!" });
      cancelarEdicao();
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao salvar missão" });
      console.error(error);
    }
  };

  const confirmarDelecao = (id?: number) => {
    if (!id) return;
    setMissaoParaDeletar(id);
    setConfirmDialogVisible(true);
  };

  const deletarMissaoConfirmado = async () => {
    if (!missaoParaDeletar) return;

    try {
      const response = await fetch(`http://localhost:8080/missao/${missaoParaDeletar}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao deletar missão");

      setMissoes((prev) => prev.filter((m) => m.id !== missaoParaDeletar));
      setAlert({ type: "success", message: "Missão deletada com sucesso!" });
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao deletar missão" });
      console.error(error);
    } finally {
      setConfirmDialogVisible(false);
      setMissaoParaDeletar(null);
    }
  };

  const onChangeEditando = (field: keyof Missao, value: string) => {
    if (!editandoMissao) return;

    setEditandoMissao({
      ...editandoMissao,
      [field]: value,
    });
  };

  return (
    <main className="w-[85%] mx-auto mb-10">
      <h3 className="text-xl font-medium mb-6 text-center sm:mt-5 text-white bg-green-800 rounded-lg shadow-md">
        GERENCIAR MISSÕES
      </h3>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {missoes.length === 0 && (
        <p className="text-center text-gray-400 dark:text-white">Nenhuma missão disponível.</p>
      )}

      <div className="space-y-4">
        {missoes.map((m) => (
          <div
            key={m.id}
            className="flex items-start bg-gray-100 border-2 border-green-800 dark:bg-slate-800 dark:text-white p-4 rounded-lg shadow-md"
          >
            <div className="flex-1">
              {editandoId === m.id ? (
                <>
                  <div className="mb-2">
                    <p className="text-sm font-semibold">Título</p>
                    <input
                      type="text"
                      value={editandoMissao?.titulo || ""}
                      onChange={(e) => onChangeEditando("titulo", e.target.value)}
                      className="w-full rounded px-2 py-1 text-black"
                    />
                  </div>

                  <div className="mb-2">
                    <p className="text-sm font-semibold">Localização</p>
                    <input
                      type="text"
                      value={editandoMissao?.localizacao || ""}
                      onChange={(e) => onChangeEditando("localizacao", e.target.value)}
                      className="w-full rounded px-2 py-1 text-black"
                    />
                  </div>

                  <div className="mb-2">
                    <p className="text-sm font-semibold">Organização</p>
                    <input
                      type="text"
                      value={editandoMissao?.organizacao || ""}
                      onChange={(e) => onChangeEditando("organizacao", e.target.value)}
                      className="w-full rounded px-2 py-1 text-black"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Descrição</p>
                    <textarea
                      value={editandoMissao?.descricao || ""}
                      onChange={(e) => onChangeEditando("descricao", e.target.value)}
                      className="w-full rounded px-2 py-1 text-black"
                    />
                  </div>
                </>
              ) : (
                <>
                  <p className="text-lg font-bold">{m.titulo}</p>
                  <p><strong>Localização:</strong> {m.localizacao}</p>
                  <p><strong>Organização:</strong> {m.organizacao}</p>
                  <p className="dark:text-white"><strong>Descrição:</strong> {m.descricao}</p>
                  <p className="text-sm dark:text-gray-300 italic">Criada em: {m.dataCriacaoFormata}</p>
                </>
              )}
            </div>

            {editandoId === m.id ? (
              <>
                <button
                  onClick={salvarEdicao}
                  title="Salvar"
                  className="mr-2 text-green-600 hover:text-green-400"
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={cancelarEdicao}
                  title="Cancelar"
                  className="text-red-600 hover:text-red-400"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => iniciarEdicao(m)}
                  title="Editar"
                  className="mr-2 text-blue-600 hover:text-blue-400"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => confirmarDelecao(m.id)}
                  title="Deletar"
                  className="text-red-600 hover:text-red-400"
                >
                  <Trash2 size={20} />
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {confirmDialogVisible && (
        <Dialogo
          title="Confirmar Exclusão"
          message="Tem certeza que deseja deletar esta missão?"
          onConfirm={deletarMissaoConfirmado}
          onCancel={() => setConfirmDialogVisible(false)}
        />
      )}
    </main>
  );
}
