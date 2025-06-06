"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle } from "lucide-react";
import AlertMessage from "../components/alerta";

type Notificacao = {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  recomendacao: string;
};

type Missao = {
  id: number;
  titulo: string;
  localizacao: string;
  organizacao: string;
  descricao: string;
  dataCriacaoFormata: string;
};

type NotificacaoAPI = {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  recomendacao: string;
};

type MissaoAPI = {
  id: number;
  titulo: string;
  localizacao: string;
  organizacao: string;
  descricao: string;
  dataCriacaoFormata: string;
};

export default function Home() {
  const router = useRouter();
  const [alertas, setAlertas] = useState<Notificacao[]>([]);
  const [missoes, setMissoes] = useState<Missao[]>([]);
  const [dataAtual, setDataAtual] = useState<string>("");
  const [inscricoes, setInscricoes] = useState<number[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleInscricao = (id: number) => {
    if (!inscricoes.includes(id)) {
      const missaoInscrita = missoes.find((m) => m.id === id);
      if (missaoInscrita) {
        const armazenadas = JSON.parse(localStorage.getItem("minhasMissoes") || "[]");
        armazenadas.push(missaoInscrita);
        localStorage.setItem("minhasMissoes", JSON.stringify(armazenadas));
      }

      const novasInscricoes = [...inscricoes, id];
      setInscricoes(novasInscricoes);
      localStorage.setItem("inscricoes", JSON.stringify(novasInscricoes));

      setAlertMessage("Você se inscreveu com sucesso na missão!");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const buscarAlertas = async () => {
    try {
      const response = await fetch("https://gs-java-production-9228.up.railway.app/alerta/listar");
      if (!response.ok) throw new Error("Erro ao buscar alertas");

      const data: NotificacaoAPI[] = await response.json();

      const alertasMapeados: Notificacao[] = data.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        localizacao: item.localizacao,
        descricao: item.descricao,
        recomendacao: item.recomendacao,
      }));

      setAlertas(alertasMapeados);
    } catch (error) {
      console.error("Erro ao buscar notificações:", error);
      setAlertas([]);
    }
  };

  const buscarMissoes = async () => {
    try {
      const response = await fetch("https://gs-java-production-9228.up.railway.app/missao/listar");
      if (!response.ok) throw new Error("Erro ao buscar missões");

      const data: MissaoAPI[] = await response.json();

      const missoesMapeadas: Missao[] = data.map((item) => ({
        id: item.id,
        titulo: item.titulo,
        localizacao: item.localizacao,
        organizacao: item.organizacao,
        descricao: item.descricao,
        dataCriacaoFormata: item.dataCriacaoFormata,
      }));

      setMissoes(missoesMapeadas);
    } catch (error) {
      console.error("Erro ao buscar missões:", error);
      setMissoes([]);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    buscarAlertas();
    buscarMissoes();

    const data = new Date();
    const dataFormatada = data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    setDataAtual(dataFormatada);

    const inscricoesSalvas = JSON.parse(localStorage.getItem("inscricoes") || "[]");
    setInscricoes(inscricoesSalvas);

    document.title = "Home";
  }, [router]);

  return (
    <main>
      {showAlert && (
        <AlertMessage
          type="success"
          message={alertMessage}
          onClose={() => setShowAlert(false)}
        />
      )}
      <div className="w-[85%] max-w-7xl mx-auto mb-10">
        <h4 className="text-gray-500 dark:text-white mt-4 text-right text-sm">
          Atualizado em {dataAtual}
        </h4>

        <h3 className="text-2xl font-bold mt-4 text-center bg-red-800 dark:bg-red-900 dark:text-white text-white p-1 rounded-xl shadow-md">
          ALERTAS
        </h3>

        {alertas.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-white mt-6">
            Nenhum alerta disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {alertas.map((n) => (
              <div
                key={n.id}
                className="bg-red-100 dark:bg-red-800 text-red-900 dark:text-white p-5 rounded-xl shadow-lg border-l-8 border-red-500 flex flex-col h-full"
              >
                <div className="items-center gap-2">
                  <AlertTriangle size={26} className="text-red-600 dark:text-white" />
                  <h4 className="text-lg font-bold leading-snug">{n.titulo}</h4>
                </div>

                <p className="text-sm italic bg-red-900 dark:bg-white rounded-md text-white dark:text-red-900 pl-2 pr-2 pt-1 pb-1 mb-2">
                  Local: <span className="font-medium">{n.localizacao}</span>
                </p>

                <p className="mb-2 flex-1">{n.descricao}</p>

                {n.recomendacao && (
                  <p className="text-sm bg-slate-100 dark:bg-white dark:text-red-900 p-2 rounded-md">
                    <strong>Recomendação:</strong> {n.recomendacao}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        <h3 className="text-2xl font-bold mt-6 text-center bg-green-800 dark:bg-green-900 dark:text-white text-white p-1 rounded-xl shadow-md">
          MISSÕES
        </h3>

        {missoes.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-white mt-6">
            Nenhuma missão disponível.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            {missoes.map((m) => (
              <div
                key={m.id}
                className="bg-green-100 dark:bg-green-800 text-green-900 dark:text-white p-5 rounded-xl shadow-lg border-l-8 border-green-500 flex flex-col h-full"
              >
                <div className="items-center gap-2">
                  <CheckCircle size={24} className="text-green-600 dark:text-white" />
                  <h4 className="text-lg font-bold">{m.titulo}</h4>
                </div>

                <p className="text-xs text-right text-gray-600 dark:text-gray-300 mb-2">
                  Criado em {m.dataCriacaoFormata}
                </p>

                <p className="text-sm italic bg-green-800 dark:bg-white rounded-md text-white dark:text-green-800 pl-2 pr-2 pt-1 pb-1 mb-2">
                  Local: <span className="font-medium">{m.localizacao}</span>
                </p>
                <p className="text-sm italic mb-1">
                  Organização: <span className="font-medium">{m.organizacao}</span>
                </p>
                <p className="mb-2 flex-1">{m.descricao}</p>
                <button
                  onClick={() => handleInscricao(m.id)}
                  disabled={inscricoes.includes(m.id)}
                  className={`${
                    inscricoes.includes(m.id)
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } rounded-md pt-1 pb-1 text-white shadow-md mt-auto`}
                >
                  {inscricoes.includes(m.id) ? "Inscrição feita" : "Quero me Inscrever"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
