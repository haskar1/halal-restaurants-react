export default function CuisineTag({ cuisines }) {
  const colors = {
    red: {
      backgroundColor: "pink",
      border: "1px solid darkred",
      color: "darkred",
    },
    orange: {
      backgroundColor: "#fff7e7",
      border: "1px solid #b15200",
      color: "#b15200",
    },
    yellow: {
      backgroundColor: "#fff6c6",
      border: "1px solid darkred",
      color: "darkred",
    },
    blue: {
      backgroundColor: "#e8e8fc",
      border: "1px solid #4f4ff3",
      color: "#4f4ff3",
    },
  };

  if (cuisines?.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 h-fit justify-center">
      {cuisines.map((cuisine) => (
        <p
          key={cuisine.id}
          style={{
            ...colors[cuisine.tag_color],
            padding: "0.07rem 0.21rem",
            borderRadius: "5px",
            fontSize: "0.9rem",
          }}
        >
          {cuisine.name}
        </p>
      ))}
    </div>
  );
}
