import { describe, expect, it } from "vitest";
import { DELIVERY_ROUTE, ROUTE_DISTANCE_KM, routePoint } from "@/lib/delivery-route";

describe("demo delivery route", () => {
  it("clamps the courier to the route endpoints", () => {
    expect(routePoint(-1)).toEqual(DELIVERY_ROUTE[0]);
    expect(routePoint(1)).toEqual(DELIVERY_ROUTE.at(-1));
    expect(routePoint(2)).toEqual(DELIVERY_ROUTE.at(-1));
  });
  it("moves along the road geometry", () => {
    expect(DELIVERY_ROUTE.length).toBeGreaterThan(100);
    expect(ROUTE_DISTANCE_KM).toBeGreaterThan(0);
    const halfway = routePoint(0.5);
    expect(halfway).not.toEqual(DELIVERY_ROUTE[0]);
    expect(halfway).not.toEqual(DELIVERY_ROUTE.at(-1));
    expect(halfway.every(Number.isFinite)).toBe(true);
  });
});