import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route } from "react-router-dom";
import App from "../App";

describe("App", () => {
    it("renders header and routes correctly", () => {
        render(
            // Set up a MemoryRouter to simulate routing behavior
            <MemoryRouter initialEntries={["/"]} initialIndex={0}>
                {/* Define a Route with the path "/" and render the App component */}
                <Route path="/">
                    <App />
                </Route>
            </MemoryRouter>
        );

        // Check if the "SnapShot" header is rendered correctly
        const headerElement = screen.getByText("SnapShot");
        expect(headerElement).toBeInTheDocument();

        // Check if the "mountain Pictures" text is rendered correctly
        const itemElement = screen.getByText(/mountain Pictures/i);
        expect(itemElement).toBeInTheDocument();
    });
});
