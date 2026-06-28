import React, { useEffect, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import CaptureControl from "../Components/CaptureControl/CaptureControl";
import DashboardCard2 from "../Components/DashboardCard2/DashboardCard2";
import LivePacketStream from "../Components/LivePacketStream/LivePacketStream";
import DashboardPieChart from "../../SOAR/Components/DashboardPieChart/DashboardPieChart";
import NetworkAlert from "../Components/Shared/NetworkAlert";
import usePacketSniffing from "../hooks/usePacketSniffing";
import { formatNumber } from "../utils/normalizers";

export default function PacketCapture() {
  const { setTitle } = useOutletContext();
  const { stream, loading, error, active, startCapture, stopCapture } = usePacketSniffing();

  useEffect(() => {
    setTitle("Packet Capture");
  }, [setTitle]);

  const protocolChartData = useMemo(() => {
    const protocols = stream?.protocols ?? {};
    const entries = Object.entries(protocols);
    if (!entries.length) return null;
    return {
      labels: entries.map(([k]) => k),
      datasets: [
        {
          data: entries.map(([, v]) => v),
          backgroundColor: ["#06b6d4", "#22c55e", "#eab308", "#A5B4FC", "#ef4444", "#f97316"],
        },
      ],
    };
  }, [stream]);

  return (
    <>
      <NetworkAlert error={error} />

      <CaptureControl
        onStart={startCapture}
        onStop={stopCapture}
        loading={loading}
        active={active}
      />

      <div className="row align-items-center mb-3 justify-content-around">
        <DashboardCard2 text="Total Packets" Statistics={formatNumber(stream?.stats?.totalPackets ?? 0)} />
        <DashboardCard2 text="Protocols" Statistics={formatNumber(stream?.stats?.protocols ?? 0)} />
        <DashboardCard2 text="Avg PPS" Statistics={formatNumber(stream?.stats?.avgPps ?? 0)} />
        <DashboardCard2 text="Suspicious Packets" Statistics={formatNumber(stream?.stats?.suspicious ?? 0)} />
      </div>

      <div className="row g-4 align-items-stretch mb-4 mb-lg-5">
  {/* Live Packet Stream */}
  <div className="col-12 col-xl-8">
    <div className="dashboard-card rounded-4 overflow-hidden h-100">
      <LivePacketStream
        packets={stream?.packets ?? []}
        active={active}
      />
    </div>
  </div>

  <div className="col-12 col-xl-4">
    <div className="dashboard-card rounded-4 p-4 h-100 d-flex flex-column">
      <h6 className="text-white mb-4">
        Protocol Breakdown
      </h6>

      <div className="flex-grow-1 d-flex justify-content-center align-items-center">
        {protocolChartData ? (
          <DashboardPieChart />
        ) : (
          <p className="text-secondary text-center mb-0">
            Start capture to view protocol distribution.
          </p>
        )}
      </div>

      {stream?.protocols && Object.keys(stream.protocols).length > 0 && (
        <ul className="list-unstyled mt-4 mb-0">
          {Object.entries(stream.protocols).map(([proto, count]) => (
            <li
              key={proto}
              className="d-flex justify-content-between align-items-center py-2 border-bottom border-secondary-subtle"
            >
              <span className="text-secondary">{proto}</span>
              <span className="fw-semibold text-white">
                {count}%
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</div>
    </>
  );
}
