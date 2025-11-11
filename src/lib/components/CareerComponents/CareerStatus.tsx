export default function CareerStatus({ status }: { status: string }) {
  return (
    <div
      style={{
        borderRadius: "60px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: "5px",
        padding: "0px 8px",
        backgroundColor:
          status === "active" ? "#ECFDF3" : status === "draft" ? "#FFF8E1" : "#F5F5F5",
        border:
          status === "active"
            ? "1px solid #A6F4C5"
            : status === "draft"
              ? "1px solid #FFA500"
              : "1px solid #E9EAEB",
      }}
    >
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor:
            status === "active" ? "#12B76A" : status === "draft" ? "#FFA500" : "#717680",
        }}
      ></div>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 700,
          color: status === "active" ? "#027948" : status === "draft" ? "#FFA500" : "#414651",
        }}
      >
        {status === "active" ? "Published" : status === "draft" ? "Draft" : "Unpublished"}
      </span>
    </div>
  );
}
