"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Check, X } from "lucide-react";
import AlertMessage from "../components/alerta";
import Dialogo from "../components/dialogo";

type Alerta = {
  id?: number;
  titulo: string;
  localizacao: string;
  descricao: string;
  recomendacao?: string;
  cor?: string;
  sigla?: string;
};

type AlertType = "success" | "error";

export default function GerenciarAlerta() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [editandoAlerta, setEditandoAlerta] = useState<Alerta | null>(null);
  const [alert, setAlert] = useState<{ type: AlertType; message: string } | null>(null);
  const [confirmDialogVisible, setConfirmDialogVisible] = useState(false);
  const [alertaParaDeletar, setAlertaParaDeletar] = useState<number | null>(null);

  const buscarAlertas = async () => {
    try {
      const response = await fetch("http://localhost:8080/alerta/listar");
      const data = await response.json();

      const alertasComEstilo = data.map((a: Alerta) => {
        let cor = "bg-gray-400";
        let sigla = a.localizacao?.charAt(0)?.toUpperCase() || "?";

        return { ...a, cor, sigla };
      });

      setAlertas(alertasComEstilo);
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao buscar alertas" });
      setAlertas([]);
      console.error(error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    buscarAlertas();
    document.title = "Gerenciar Alertas";
  }, [router]);

  const iniciarEdicao = (alerta: Alerta) => {
    setEditandoId(alerta.id ?? null);
    setEditandoAlerta({ ...alerta });
  };

  const cancelarEdicao = () => {
    setEditandoId(null);
    setEditandoAlerta(null);
  };

  const salvarEdicao = async () => {
    if (!editandoAlerta || editandoId === null) return;

    try {
      const payload = {
        titulo: editandoAlerta.titulo,
        descricao: editandoAlerta.descricao,
        localizacao: editandoAlerta.localizacao,
        recomendacao: editandoAlerta.recomendacao,
      };

      const response = await fetch(`http://localhost:8080/alerta/${editandoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Falha ao atualizar alerta");

      const alertaAtualizado = await response.json();

      setAlertas((prev) =>
        prev.map((a) =>
          a.id === editandoId ? { ...alertaAtualizado, cor: a.cor, sigla: a.sigla } : a
        )
      );

      setAlert({ type: "success", message: "Alerta atualizado com sucesso!" });
      cancelarEdicao();
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao salvar alerta" });
      console.error(error);
    }
  };

  const confirmarDelecao = (id?: number) => {
    if (!id) return;
    setAlertaParaDeletar(id);
    setConfirmDialogVisible(true);
  };

  const deletarAlertaConfirmado = async () => {
    if (!alertaParaDeletar) return;

    try {
      const response = await fetch(`http://localhost:8080/alerta/${alertaParaDeletar}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Falha ao deletar alerta");

      setAlertas((prev) => prev.filter((a) => a.id !== alertaParaDeletar));
      setAlert({ type: "success", message: "Alerta deletado com sucesso!" });
    } catch (error) {
      setAlert({ type: "error", message: "Erro ao deletar alerta" });
      console.error(error);
    } finally {
      setConfirmDialogVisible(false);
      setAlertaParaDeletar(null);
    }
  };

  const onChangeEditando = (field: keyof Alerta, value: string) => {
    if (!editandoAlerta) return;

    setEditandoAlerta({
      ...editandoAlerta,
      [field]: value,
    });
  };

  return (
    <main className="w-[85%] mx-auto mb-10">
      <h3 className="text-xl font-medium mb-6 text-center sm:mt-5 text-white bg-red-700 rounded-lg shadow-md">
        GERENCIAR ALERTAS
      </h3>

      {alert && (
        <AlertMessage
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {alertas.length === 0 && (
        <p className="text-center text-gray-400 dark:text-white">Nenhum alerta disponível.</p>
      )}

      <div className="space-y-4">
        {alertas.map((a) => (
          <div
            key={a.id}
            className="flex items-start bg-gray-100 border-2 border-red-700 dark:bg-slate-800 dark:text-white p-4 rounded-lg shadow-md"
          >

            <div className="flex-1">
              {editandoId === a.id ? (
                <>
            <div className="mb-2">
              <p className="text-sm font-semibold">Título</p>
              <input
                type="text"
                value={editandoAlerta?.titulo || ""}
                onChange={(e) => onChangeEditando("titulo", e.target.value)}
                className="w-full rounded px-2 py-1 text-black"
              />
            </div>

            <div className="mb-2">
              <p className="text-sm font-semibold">Localização</p>
              <input
                type="text"
                value={editandoAlerta?.localizacao || ""}
                onChange={(e) => onChangeEditando("localizacao", e.target.value)}
                className="w-full rounded px-2 py-1 text-black"
              />
            </div>

            <div className="">
              <p className="text-sm font-semibold">Descrição</p>
              <textarea
                value={editandoAlerta?.descricao || ""}
                onChange={(e) => onChangeEditando("descricao", e.target.value)}
                className="w-full rounded px-2 py-1 text-black"
              />
            </div>

            <div>
              <p className="text-sm font-semibold">Recomendação</p>
              <textarea
                value={editandoAlerta?.recomendacao || ""}
                onChange={(e) => onChangeEditando("recomendacao", e.target.value)}
                className="w-full rounded px-2 py-1 text-black"
              />
            </div>
          </>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-bold">Título: {a.titulo}</p>
                    <p className="text-lg font-semibold">Localização: {a.localizacao}</p>
                  </div>
                  <p className="dark:text-white">Descrição: {a.descricao}</p>
                  <p className="text-sm dark:text-gray-300 italic">
                    Recomendação: {a.recomendacao}
                  </p>
                </>
              )}
            </div>

            {editandoId === a.id ? (
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
                  onClick={() => iniciarEdicao(a)}
                  title="Editar"
                  className="mr-2 text-blue-600 hover:text-blue-400"
                >
                  <Pencil size={20} />
                </button>
                <button
                  onClick={() => confirmarDelecao(a.id)}
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
          message="Tem certeza que deseja deletar este alerta?"
          onConfirm={deletarAlertaConfirmado}
          onCancel={() => setConfirmDialogVisible(false)}
        />
      )}
    </main>
  );
}
