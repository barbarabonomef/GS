"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const FooterModerador = () => {
  const pathname = usePathname();

  // Esconde links se estiver na página inicial
  const esconderLinks = pathname === "/" || pathname === "/cadastro";

  return (
    <footer className="bg-cyan-950 dark:bg-gray-950 h-[85px] text-xs flex items-center justify-between text-white">  
      
      <div className={`flex ${esconderLinks ? "invisible" : ""} justify-start sm:gap-5 lg:gap-40 ml-24`} aria-hidden={esconderLinks}>
        <div className="flex flex-col underline">
          <Link href="/home">ALERTAS E MISSÕES</Link>
          <Link href="/gerenciarAlertas">GERENCIAR ALERTAS</Link>
          <Link href="/gerenciarMissoes">GERENCIAR MISSÕES</Link>
        </div>
        <div className="flex flex-col underline">
          <Link href="/criarAlertas">CRIAR ALERTAS</Link>
          <Link href="/criarMissoes">CRIAR MISSÕES</Link>
          <Link href="/integrantes">INTEGRANTES</Link>
        </div>
      </div>

      <div className="flex flex-col items-end mr-24 lg:text-xs">
        <Image src="/images/logo.png" width={65} height={0} alt="logo" />
        <p className="hidden xl:block text-white">© Copyright 2025 | Grupo ELO</p>
      </div>
    </footer>
  );
};

export default FooterModerador;
