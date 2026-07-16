// We import special tools to help us render and test React components
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarkAttendance from './MarkAttendance';

// ─────────────────────────────────────────────
// WHAT IS THIS FILE?
// These are tests for the MarkAttendance page.
// They check that the page looks and behaves correctly.
// ─────────────────────────────────────────────


// ─── TEST 1 ───
test('the page shows a title "Mark My Attendance"', () => {
  // Step 1: Render (display) the MarkAttendance component
  render(<MarkAttendance />);

  // Step 2: Look for text on the page
  const title = screen.getByText(/Mark My Attendance/i);

  // Step 3: Check it exists in the page
  expect(title).toBeInTheDocument();
});


// ─── TEST 2 ───
test('the "Open Camera" button is visible at the start', () => {
  // Render the component
  render(<MarkAttendance />);

  // Look for the "Open Camera" button on the page
  const cameraButton = screen.getByText(/Open Camera/i);

  // The button should be visible
  expect(cameraButton).toBeInTheDocument();
});


// ─── TEST 3 ───
test('today\'s date is shown on the page', () => {
  // Render the component
  render(<MarkAttendance />);

  // Get today's date in the format the component uses (e.g., "2026-07-17")
  const today = new Date().toISOString().split('T')[0];

  // Look for that date somewhere on the page
  const dateText = screen.getByText(today);

  // Check it exists
  expect(dateText).toBeInTheDocument();
});


// ─── TEST 4 ───
test('the "Capture Photo" button is NOT visible before clicking Open Camera', () => {
  // Render the component
  render(<MarkAttendance />);

  // Look for the "Capture Photo" button — it should NOT be there yet
  // queryByText returns null if the element is not found (unlike getByText which throws error)
  const captureButton = screen.queryByText(/Capture Photo/i);

  // It should be null (not found)
  expect(captureButton).not.toBeInTheDocument();
});


// ─── TEST 5 ───
test('the "Back" button is visible', () => {
  // Render the component
  render(<MarkAttendance />);

  // Look for the Back button
  const backButton = screen.getByText(/Back/i);

  // It should be there
  expect(backButton).toBeInTheDocument();
});
