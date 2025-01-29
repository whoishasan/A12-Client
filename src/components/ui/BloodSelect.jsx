const BloodSelect = ({ bloodGroupe, setbloodGroupe }) => {
  return (
    <>
      <div>
        {BloodGroupe &&
          BloodGroupe.map((blood, index) => (
            <button
              onClick={() => {
                setbloodGroupe(blood?.type);
              }}
              key={index}
              type="button"
              style={{ backgroundColor: `${blood?.color}` }}
              className={`text-white text-sm hover:ring-2 transition-all ring-red-500 hover:z-20 relative ring-offset-2 font-semibold p-1 px-3 ${
                blood?.type === bloodGroupe && "ring-2 z-20"
              }`}
            >
              {blood?.type}
            </button>
          ))}
      </div>
    </>
  );
};

export default BloodSelect;

export const BloodGroupe = [
  {
    type: "A+",
    color: "#D50032", // A bright, oxygenated red
  },
  {
    type: "A-",
    color: "#9E0000", // Darker red, oxygen-poor blood
  },
  {
    type: "B+",
    color: "#B21800", // A deep red with an orange tint
  },
  {
    type: "B-",
    color: "#8B0000", // Darker, deeper red with brownish hue
  },
  {
    type: "AB+",
    color: "#F30D30", // A vibrant, mix of A and B type reds
  },
  {
    type: "AB-",
    color: "#9C1D1D", // Deep red with a slight muted tone
  },
  {
    type: "O+",
    color: "#FF1C00", // Bright, oxygen-rich blood
  },
  {
    type: "O-",
    color: "#700000", // Darker, deoxygenated red
  },
];
