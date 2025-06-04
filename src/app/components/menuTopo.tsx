"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const MenuTopo = () => {
    const caminhoAtual = usePathname();
    const [rotaAtiva, setRotaAtiva] = useState("");

    useEffect(() => {
        setRotaAtiva(caminhoAtual);
    }, [caminhoAtual]);

    return (
        <div className="hidden xl:flex items-center justify-center mt-3 mb-3">
            <a href="/home">
                <button 
                    className={`bg-gray-200 dark:bg-slate-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/home" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    ALERTAS E MISSÕES
                </button>
            </a>

            <a href="/minhasMissoes">
                <button 
                    className={`bg-gray-200 dark:bg-slate-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/minhasMissoes" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    MINHAS MISSÕES
                </button>
            </a>

            <a href="/integrantes">
                <button 
                    className={`bg-gray-200 dark:bg-slate-950 dark:text-white pt-2 pb-2 pr-3 pl-3 rounded-full m-1 ${rotaAtiva === "/integrantes" ? "border-2 border-black dark:border-white" : ""}`}
                >
                    INTEGRANTES
                </button>
            </a>
        </div>
    );
};

export default MenuTopo;
