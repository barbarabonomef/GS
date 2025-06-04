"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MenuTopoModerador = () => {
    const caminhoAtual = usePathname();
    const [rotaAtiva, setRotaAtiva] = useState("");

    useEffect(() => {
        setRotaAtiva(caminhoAtual);  // Atualiza a rota ativa sempre que a página mudar
    }, [caminhoAtual]);

    return (
        <div className="hidden xl:flex items-center justify-center mt-3 mb-3">
            <a href="/home">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/home" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    ALERTAS E MISSÕES
                </button>
            </a>

                        <a href="/criarAlertas">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/criarNotificacao" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    CRIAR ALERTAS
                </button>
            </a>

            <a href="/criarMissoes">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/criarNotificacao" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    CRIAR MISSÕES
                </button>
            </a>

            <a href="/gerenciarAlertas">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/gerenciarNotificacoes" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    GERENCIAR ALERTAS
                </button>
            </a>

            <a href="/gerenciarMissoes">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/gerenciarNotificacoes" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    GERENCIAR MISSÕES
                </button>
            </a>

            <a href="/integrantes">
                <button 
                    className={`bg-gray-200 dark:bg-cyan-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/integrantes" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    INTEGRANTES
                </button>
            </a>
        </div>
    );
};

export default MenuTopoModerador;
