"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AlertMessage from "../components/alerta";

export default function CriarAlerta() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Criar Alerta";
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }
  }, [router]);

  const [titulo, setTitulo] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [recomendacao, setRecomendacao] = useState("");

  const [alerta, setAlerta] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (alerta) {
      const timer = setTimeout(() => setAlerta(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [alerta]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const novoAlerta = {
      titulo,
      localizacao,
      descricao,
      recomendacao,
    };

    try {
      const resposta = await fetch("http://localhost:8080/alerta/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(novoAlerta),
      });

      const data = await resposta.text();
      console.log(data);

      if (resposta.ok) {
        setAlerta({ type: "success", message: "Alerta criado com sucesso!" });
        setTitulo("");
        setLocalizacao("");
        setDescricao("");
        setRecomendacao("");
      } else {
        setAlerta({ type: "error", message: "Erro ao criar alerta: " + data });
      }
    } catch (error) {
      console.error("Erro:", error);
      setAlerta({ type: "error", message: "Erro ao conectar com o servidor." });
    }
  };

  return (
    <>
      {alerta && (
        <AlertMessage
          type={alerta.type}
          message={alerta.message}
          onClose={() => setAlerta(null)}
        />
      )}

      <main>
        <form
          onSubmit={handleSubmit}
          className="max-w-[400px] sm:max-w-[450px] md:max-w-[580px] lg:max-w-[800px] mx-auto bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow-md mt-8 mb-10"
        >
          <p className="text-xl font-bold text-gray-700 dark:text-white text-center mb-4">
            Preencha os dados abaixo para criar um Alerta
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Título do Alerta
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Localização
              </label>
              <input
                type="text"
                value={localizacao}
                onChange={(e) => setLocalizacao(e.target.value)}
                placeholder="Ex: Rua Nove de Julho"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Descrição
              </label>
              <textarea
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={4}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white font-medium mb-2">
                Recomendação
              </label>
              <textarea
                value={recomendacao}
                onChange={(e) => setRecomendacao(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="inline-block px-6 py-2 bg-red-500 dark:bg-red-600 text-white font-bold rounded-md hover:bg-red-600 transition"
              >
                Enviar Alerta
              </button>
            </div>
          </div>
        </form>
      </main>
    </>
  );
}
