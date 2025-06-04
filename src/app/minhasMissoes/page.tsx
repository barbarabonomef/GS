"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

type Missao = {
  id: number;
  titulo: string;
  localizacao: string;
  organizacao: string;
  descricao: string;
  dataCriacaoFormata: string;
};

export default function MinhasMissoes() {
  const [minhasMissoes, setMinhasMissoes] = useState<Missao[]>([]);

  useEffect(() => {
    const armazenadas = JSON.parse(localStorage.getItem("minhasMissoes") || "[]");
    setMinhasMissoes(armazenadas);
  }, []);

  const desinscrever = (id: number) => {
    // Remover missão do localStorage
    const atualizadas = minhasMissoes.filter((m) => m.id !== id);
    localStorage.setItem("minhasMissoes", JSON.stringify(atualizadas));
    setMinhasMissoes(atualizadas);

    // Também remove do array de IDs salvos (caso você esteja usando no Home)
    const inscricoes = JSON.parse(localStorage.getItem("inscricoes") || "[]");
    const novasInscricoes = inscricoes.filter((i: number) => i !== id);
    localStorage.setItem("inscricoes", JSON.stringify(novasInscricoes));
  };

  const limpar = () => {
    localStorage.removeItem("minhasMissoes");
    localStorage.removeItem("inscricoes");
    setMinhasMissoes([]);
  };

  return (
    <main className="w-[85%] max-w-7xl mx-auto mb-10">
      <h3 className="text-2xl font-bold mt-10 text-center bg-green-800 dark:bg-green-900 dark:text-white text-white p-1 rounded-xl shadow-md">
        MINHAS MISSÕES
      </h3>

      {minhasMissoes.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-white mt-6">
          Você ainda não se inscreveu em nenhuma missão.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {minhasMissoes.map((m) => (
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
                onClick={() => desinscrever(m.id)}
                className="mt-auto bg-red-600 hover:bg-red-700 text-white rounded-md py-1 flex items-center justify-center gap-2"
              >
                <XCircle size={18} />
                Desinscrever
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
