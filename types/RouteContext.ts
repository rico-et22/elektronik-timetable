export interface RouteContext {
  type: 'class' | 'teacher' | 'room' | undefined;
  typeName: string | undefined;
  name: string | undefined;
}
