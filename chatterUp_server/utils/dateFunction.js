//format Date into specific format like "23-Nov-2024"
exports.formattedDate = (date) =>
  date
    .toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

exports.getCurrentYear = new Date().getFullYear();

exports.getLastYear = Number(new Date().getFullYear()) - 1;
