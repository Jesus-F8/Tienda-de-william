// En: types/dinero.d.ts

declare module "dinero.js" {
  // Declaración mínima para decirle a TS que el módulo existe
  // y tiene una exportación por defecto (la función dinero)
  // y otras nombradas como toUnit.

  // Puedes añadir tipos más específicos aquí si quieres,
  // pero esto es suficiente para quitar el error TS7016.

  export type Currency = {
    code: string;
    base: number;
    exponent: number;
  };

  export interface DineroOptions<TAmount> {
    amount: TAmount;
    currency: Currency;
    precision?: number; // v1 usa precision, v2 usa scale
  }

  export interface Dinero<TAmount> {
    getAmount(): TAmount;
    getCurrency(): Currency;
    getLocale(): string;
    setLocale(newLocale: string): Dinero<TAmount>;
    getPrecision(): number; // v1
    convertPrecision(newPrecision: number): Dinero<TAmount>; // v1
    add(addend: Dinero<TAmount>): Dinero<TAmount>;
    subtract(subtrahend: Dinero<TAmount>): Dinero<TAmount>;
    multiply(multiplier: number, roundingMode?: RoundingMode): Dinero<TAmount>;
    divide(divisor: number, roundingMode?: RoundingMode): Dinero<TAmount>;
    percentage(percentage: number): Dinero<TAmount>;
    allocate(ratios: number[]): Dinero<TAmount>[];
    equals(comparator: Dinero<TAmount>): boolean;
    lessThan(comparator: Dinero<TAmount>): boolean;
    lessThanOrEqual(comparator: Dinero<TAmount>): boolean;
    greaterThan(comparator: Dinero<TAmount>): boolean;
    greaterThanOrEqual(comparator: Dinero<TAmount>): boolean;
    isZero(): boolean;
    isPositive(): boolean;
    isNegative(): boolean;
    hasSubUnits(): boolean;
    hasSameCurrency(comparator: Dinero<TAmount>): boolean;
    hasSameAmount(comparator: Dinero<TAmount>): boolean;
    toUnit(): number; // v1 usa toUnit, v2 usa toDecimal
    toObject(): DineroObject<TAmount>;
    toJSON(): DineroObject<TAmount>;
    toString(): string;
    toFormat(format?: string, roundingMode?: RoundingMode): string; // v1
    getRaw(): DineroOptions<TAmount>; // v1
    assertSameCurrency(comparator: Dinero<TAmount>): void; // v1
    // Método convertTo de v1
    convertTo(
      currency: Currency,
      options: { rate: number; scale?: number }
    ): Dinero<TAmount>;
  }

  // Definición más completa para DineroObject y RoundingMode si son necesarios
  export interface DineroObject<TAmount> {
    amount: TAmount;
    currency: string; // código de moneda
    precision?: number;
  }

  export type RoundingMode =
    | "HALF_UP"
    | "HALF_DOWN"
    | "HALF_EVEN"
    | "HALF_ODD"
    | "DOWN"
    | "UP";

  // Exportación por defecto (la función 'dinero')
  function dinero<TAmount>(options: DineroOptions<TAmount>): Dinero<TAmount>;
  export default dinero;

  // Otras exportaciones nombradas que usamos
  export function toUnit<TAmount>(d: Dinero<TAmount>): number;
  // Añade otras si las necesitas...
}
