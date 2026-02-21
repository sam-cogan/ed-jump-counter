export interface NavRoute {
  StarSystem: string;
  SystemAddress: number;
  StarPos: number[];
  StarClass: string;
}

export interface RouteData {
  totalJumps: number;
  completedJumps: number;
  currentSystem: string;
  destinationSystem: string;
  route: NavRoute[];
}
