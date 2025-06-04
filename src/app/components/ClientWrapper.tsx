"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import MenuTopo from "./menuTopo";
import MenuTopoColaborador from "./menuTopoModerador";
import Header from "./header";
import HeaderColaborador from "./headerModerador";
import Footer from "./footer";
import FooterModerador from "./footerModerador";
import VLibras from "./VLibras"

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [tipoUsuario, setTipoUsuario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tipo = localStorage.getItem("tipoUsuario");
    setTipoUsuario(tipo);

    const rotasPublicas = ["/", "/esqueciSenha"];
    if (!tipo && !rotasPublicas.includes(pathname)) {
      router.push("/");
    }

    setIsLoading(false);

    const handleTipoChange = () => {
      setTipoUsuario(localStorage.getItem("tipoUsuario"));
    };

    window.addEventListener("tipoUsuarioChange", handleTipoChange);
    return () => {
      window.removeEventListener("tipoUsuarioChange", handleTipoChange);
    };
  }, [pathname, router]);

  if (isLoading) return null;

  return (
    <>
      {tipoUsuario === "Moderador" ? <HeaderColaborador /> : <Header />}
      {pathname !== "/" && pathname !== "/" && pathname !== "/esqueciSenha" && pathname !== "/cadastro" &&
        (tipoUsuario === "Moderador" ? <MenuTopoColaborador /> : <MenuTopo />)}

      {children}

      {tipoUsuario === "Moderador" ? <FooterModerador /> : <Footer />}
    <VLibras/>
    </>
  );
}
