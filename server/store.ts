import { PacketCarTelemetryData } from "@/types/CarTelemetryData";
import TsDbV2 from "./tsdb/TsDbV2";

export class Store {
  speed = new TsDbV2({ bucketSizes: [1, "264ms", "20hz"] });

  storeTelemetry(packet: PacketCarTelemetryData) {
    const playerCarIndex = packet.m_header.player_car_index;
    const now = Date.now();
    this.speed.push({
      id: now,
      timestamp: now,
      amount: packet.m_carTelemetryData[1].m_speed,
    });
  }

  getSpeed(start: Date, end: Date) {
    return this.speed.getAggregatesByGranularity({
      granularity: "264ms",
      start,
      end,
    });
  }

  getSpeedForLast2Seconds() {
    return this.speed.range(new Date(Date.now() - 2000), new Date(), true);
  }
}
