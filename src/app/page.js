"use client";
import { useEffect, useState } from "react";
import data from "./../../test.json";
import { Accordion, Button, Toggle } from "react-daisyui";

export default function Page() {
  const pageSize = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState(typeof window === "undefined" ? "dark" : localStorage.getItem("theme") ?? "dark");

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const filteredData = data.Designations.Designation.filter((item) =>
    item.UniqueID._text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const dataForCurrentPage = filteredData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(
    data.Designations?.Designation?.length / pageSize
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.querySelector("html").setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className="flex flex-col flex-wrap justify-center items-center w-full gap-2 p-4">
      <div className="flex gap-5">
        <input
          className="input input-bordered"
          type="search"
          placeholder="Buscar por ID "
          value={searchQuery}
          onChange={handleSearch}
        />
        <div className="flex items-center gap-2">
          <span>Cambiar Tema</span>
          <Toggle onClick={toggleTheme} />
        </div>
      </div>
      {dataForCurrentPage.map((item) => (
        <Accordion
          className="bg-base-200"
          key={item.UniqueID._text}
          icon="arrow"
        >
          <Accordion.Title className="text-center">
            <div>{item.UniqueID._text}</div>
          </Accordion.Title>
          <Accordion.Content className="flex flex-wrap flex-col justify-center">
            <div>
              <span className="font-bold">Nombre del Regimen: </span>
              {item.RegimeName._text}
            </div>
            <div>
              <span className="font-bold">Fecha de Designacion: </span>
              {item.DateDesignated._text}
            </div>

            <div>
              <span className="font-bold">Actualizado por Ultima Vez el: </span>
              {item?.LastUpdated?._text ?? "Sin Fecha"}
            </div>

            <div>
              <span className="font-bold">Razones de la inclusion (UK): </span>
              {item?.UKStatementofReasons?._text ?? "Sin Datos"}
            </div>

            <div>
              <span className="font-bold">Sanciones Impuestas: </span>
              {item?.SanctionsImposed?._text ?? "Sin Datos"}
            </div>

            <div>
              <div className="font-bold">Involucrado/s: </div>
              <ul className="list-disc flex flex-wrap">
                {Array.isArray(item.Names?.Name)
                  ? item.Names.Name.map((name) => (
                      <li className="ml-8" key={name.Name6?._text}>
                        {name.Name6?._text}
                      </li>
                    ))
                  : item?.Names?.Name?.Name6?._text ?? (
                      <li className="ml-8">Ninguno</li>
                    )}
              </ul>
            </div>

            <div>
              <div className="font-bold">Direccion/es: </div>
              <ul className="list-disc flex flex-wrap">
                {Array.isArray(item.Addresses?.Address)
                  ? item.Addresses.Address.map((address) => (
                      <li className="ml-8" key={address?.AddressLine1?._text}>
                        <span>
                          <span className="font-bold">Direccion:</span>{" "}
                          {address?.AddressLine1?._text ?? "No hay Datos"}{" "}
                        </span>
                        <span>
                          <span className="font-bold">Pais:</span>{" "}
                          {address?.AddressCountry?._text ?? "No hay Datos"}
                        </span>
                      </li>
                    ))
                  : (
                      <li className="ml-8">
                        Direccion y Pais:{" "}
                        {(item?.Addresses?.Address?.AddressLine1?._text ?? "Sin Datos Direccion") +
                          " " +
                          (item?.Addresses?.Address?.AddressCountry?._text ?? "Sin Datos Pais")}
                      </li>
                    ) ?? <li className="ml-8">Ninguno</li>}
              </ul>
            </div>

            <div>
              <span className="font-bold">Otra Informacion: </span>
              {item?.OtherInformation?._text ?? "Sin Datos"}
            </div>
          </Accordion.Content>
        </Accordion>
      ))}
      <div className="flex items-center gap-4">
        {/* Pagination Controls */}
        <Button onClick={() => handlePageChange(currentPage - 1)}>
          Anterior
        </Button>
        <span>Pagina: {currentPage}</span>
        <span>Paginas Totales: {totalPages}</span>
        <Button onClick={() => handlePageChange(currentPage + 1)}>
          Siguiente
        </Button>
      </div>
    </div>
  );
}
