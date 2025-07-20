import InputDefault from "@/components/Inputs/InputDefault";

export default function Home(): React.ReactElement {
  return (
    <>
      <h1>Eventos Fatec Itu</h1>
      <InputDefault label="Teste de Input reutilizável"/>
      <InputDefault type="password" label="Teste de Input password"/>
    </>
  );
}
