import { CarDamageData } from "@/types/CarDamageData";
import { CarTelemetryData } from "@/types/CarTelemetryData";
import { Monitorables } from "./Monitorables";
import Structure from "./Structure";
import Wings from "./Wings";

type CarProps = {
  carTelemetryData: CarTelemetryData | undefined;
  carDamageData: CarDamageData | undefined;
};

const Car = ({ carTelemetryData, carDamageData }: CarProps) => {
  return (
    <div style={{ position: "relative", height: "500px", width: "250px" }}>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Structure />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Wings />
      </div>
      <div style={{ position: "absolute", top: 0, left: 0 }}>
        <Monitorables
          carTelemetryData={carTelemetryData}
          carDamageData={carDamageData}
        />
      </div>
    </div>
  );
};

export default Car;
