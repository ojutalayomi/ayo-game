const SeedsLayout = ({ count, index }) => {
  // console.log(count, 2)
  const positions = [];
  const visibleSeeds = Math.min(count, 12);

  for (let i = 0; i < visibleSeeds; i++) {
    const angle = (i / visibleSeeds) * 2 * Math.PI;
    const radius = visibleSeeds <= 6 ? 20 : 25;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    positions.push({ x, y });
  }

  return (
    <div className="seeds-container">
      {positions.map((pos, i) => (
        <div
          key={i}
          className="seed"
          style={{
            left: `${pos.x}%`,
            top: `${pos.y}%`,
          }}
        />
      ))}
      {/* {count > 12 && <div className="extra-seeds">+{count - 12}</div>} */}
      <div className="extra-seeds">{count/*+ ', ' + index**/}</div>
    </div>
  );
};

export default SeedsLayout;
