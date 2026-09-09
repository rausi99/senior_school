import { buildPeriodColumns } from "../utils/timetableEngine";

/**
 * PrintableTimetable
 *
 * Days run down the left (rows), while periods run across the top.
 * Each period displays its actual time.
 */
export default function PrintableTimetable({
  schoolInfo,
  entityLabel,
  entityName,
  days,
  periods,
  renderCell,
  pageBreakAfter,
}) {
  const columns = buildPeriodColumns(periods);

  const generatedDate = new Date().toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`print-page ${
        pageBreakAfter ? "print-page-break" : ""
      }`}
    >
      {/* SCHOOL HEADER */}

      <div className="print-header">
        <p className="print-school-name">
          {schoolInfo.name}
        </p>

        <h1>TEACHING TIMETABLE</h1>

       <p className="print-subline">
  <strong>{entityName}</strong>

  {schoolInfo.term && (
    <>
      {" "}
      • {schoolInfo.term}
    </>
  )}
</p>
      </div>

      {/* TIMETABLE */}

      <table className="print-table">

        <thead>
          <tr>

            <th className="print-day-header">
              Day
            </th>

            {columns.map(({ period, label }, index) => (

              <th
                key={period.id}
                className={
                  period.isBreak
                    ? "print-break-header"
                    : ""
                }
              >

                {period.isBreak ? (
                  <>
                    {period.breakLabel || "Break"}

                    {period.label && (
                      <>
                        <br />
                        <small>
                          {period.label}
                        </small>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <strong>
                      Period {index + 1}
                    </strong>

                    <br />

                    <small>
                      {period.label || label}
                    </small>
                  </>
                )}

              </th>

            ))}

          </tr>
        </thead>


        <tbody>

          {days.map((day, dayIdx) => (

            <tr key={day}>

              <td className="print-day-cell">
                {day}
              </td>


              {columns.map(({ period }) =>

                period.isBreak ? (

                  <td
                    key={period.id}
                    className="print-break-cell"
                  >

                    {period.breakLabel || "Break"}

                  </td>

                ) : (

                  <td
                    key={period.id}
                    className="print-lesson-cell"
                  >

                    {renderCell(
                      dayIdx,
                      period.id
                    )}

                  </td>

                )

              )}

            </tr>

          ))}

        </tbody>

      </table>


      {/* FOOTER */}

      <p className="print-generated-date">
        Generated on {generatedDate}
      </p>

    </div>
  );
}