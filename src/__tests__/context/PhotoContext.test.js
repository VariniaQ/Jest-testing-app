import React from "react";
import { render, act } from "@testing-library/react";
import axios from "axios";
import PhotoContextProvider, { PhotoContext } from "../../context/PhotoContext";
import { apiKey } from "../../api/config";

// Mock axios to control its behavior in tests
jest.mock("axios");

describe("PhotoContext", () => {
    // Mock photo data
    const mockPhotos = [
        {
            id: "53049869507",
            owner: "196406308@N04",
            secret: "3d911c3064",
            server: "65535",
            farm: 66,
            title: "21 Looking Into Slide Mountain Fire Lookout (2)",
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
        },
        {
            id: "53050021552",
            owner: "144595143@N02",
            secret: "2e6a4ee983",
            server: "65535",
            farm: 66,
            title: "Swiss Mountain",
            ispublic: 1,
            isfriend: 0,
            isfamily: 0,
        },
    ];

    afterEach(() => {
        // Reset all mocked functions after each test
        jest.resetAllMocks();
    });

    it("fetches and sets images correctly", async () => {
        // Mock API response
        const mockResponse = {
            data: {
                photos: {
                    photo: mockPhotos,
                },
            },
        };

        // Mock the axios.get function to resolve with the mock response
        axios.get.mockResolvedValueOnce(mockResponse);

        let component;

        await act(async () => {
            // Render the component with the PhotoContextProvider and the consumer component
            component = render(
                <PhotoContextProvider>
                    <PhotoContext.Consumer>
                        {({ images, loading, runSearch }) => (
                            <div>
                                <button onClick={() => runSearch("mountain")}>Search</button>
                                {loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <ul>
                                        {images.map((photo) => (
                                            <li key={photo.id}>{photo.title}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </PhotoContext.Consumer>
                </PhotoContextProvider>
            );
        });

        // Click the search button
        const searchButton = component.getByText("Search");
        await act(async () => {
            searchButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Check the rendered photo list items
        const photoListItems = component.queryAllByRole("listitem");
        expect(photoListItems).toHaveLength(mockPhotos.length);
        expect(photoListItems[0]).toHaveTextContent(mockPhotos[0].title);
    });

    it("handles error during image fetching", async () => {
        // Create a mock error for the API call
        const mockError = new Error("API error");
        axios.get.mockRejectedValueOnce(mockError);

        // Spy on the console.log method to track logs
        const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();

        let component;

        await act(async () => {
            // Render the component with the PhotoContextProvider and the consumer component
            component = render(
                <PhotoContextProvider>
                    <PhotoContext.Consumer>
                        {({ runSearch }) => (
                            <button onClick={() => runSearch("nature")}>Search</button>
                        )}
                    </PhotoContext.Consumer>
                </PhotoContextProvider>
            );
        });

        // Click the search button
        const searchButton = component.getByText("Search");
        await act(async () => {
            searchButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        // Verify the error handling
        expect(consoleLogSpy).toHaveBeenCalledWith(
            "Encountered an error with fetching and parsing data",
            mockError
        );
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);

        // Restore the original console.log behavior
        consoleLogSpy.mockRestore();
    });
});
