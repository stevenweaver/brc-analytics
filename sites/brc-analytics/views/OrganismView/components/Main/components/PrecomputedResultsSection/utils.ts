import { type PrecomputedResultsReference } from "@brc/apis/precomputedResults";

const NCBI_BASE_URL = "https://www.ncbi.nlm.nih.gov";
const UNITS = ["B", "KB", "MB", "GB", "TB"];

/**
 * Formats a byte count for display, e.g. 1048576 -> "1.0 MB".
 * @param bytes - Size in bytes.
 * @returns Human-readable size.
 */
export function formatBytes(bytes: number): string {
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit++;
  }
  return unit === 0 ? `${value} B` : `${value.toFixed(1)} ${UNITS[unit]}`;
}

/**
 * Returns the NCBI BioProject URL for an accession.
 * @param accession - BioProject accession.
 * @returns BioProject URL.
 */
export function getBioProjectUrl(accession: string): string {
  return `${NCBI_BASE_URL}/bioproject/${accession}`;
}

/**
 * Returns the NCBI nuccore URL showing all of the reference's accessions.
 * @param reference - Reference genome.
 * @returns Nuccore URL.
 */
export function getReferenceUrl(
  reference: PrecomputedResultsReference
): string {
  return `${NCBI_BASE_URL}/nuccore/${reference.accessions.join(",")}`;
}

/**
 * Formats the reference's accessions as a range, e.g. "PP755589.1–PP755596.1".
 * @param reference - Reference genome.
 * @returns The first accession, or the first and last separated by an en dash.
 */
export function formatAccessionRange(
  reference: PrecomputedResultsReference
): string {
  const { accessions } = reference;
  return accessions.length > 1
    ? `${accessions[0]}–${accessions[accessions.length - 1]}`
    : (accessions[0] ?? "");
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Formats an ISO date for display, e.g. "2026-10-29" -> "29 Oct 2026".
 * Parsed by hand so the result does not depend on the viewer's time zone.
 * @param date - ISO date (YYYY-MM-DD).
 * @returns Display date, or the input unchanged if it is not an ISO date.
 */
export function formatDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  const name = MONTHS[month - 1];
  return name && day ? `${day} ${name} ${year}` : date;
}
