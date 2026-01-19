export type Route = 
  | "dashboard" 
  | "clientes" 
  | "cliente-detalle" 
  | "cliente-nuevo"
  | "cliente-editar"
  | "creditos" 
  | "credito-detalle" 
  | "credito-nuevo"
  | "credito-editar"
  | "bancos" 
  | "banco-detalle" 
  | "banco-nuevo"
  | "banco-editar"
  | "docs";

export interface RouteState {
  route: Route;
  params?: Record<string, string>;
}
