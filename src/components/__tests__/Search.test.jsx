import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Search from '../../pages/Search';
import { vi } from 'vitest';

// Mock react-select
vi.mock('react-select', () => ({
    default: ({ onChange, options, value, className, placeholder }) => (
        <div data-testid="mock-select-container">
            <select
                data-testid="mock-select"
                className={className}
                value={value?.value || ""}
                onChange={e => {
                    const selected = options.find(o => o.value === e.target.value);
                    onChange(selected || null);
                }}
            >
                <option value="">{placeholder || "Select..."}</option>
                {options.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                ))}
            </select>
        </div>
    ),
}));

// Mock react-datepicker
vi.mock('react-datepicker', () => ({
    default: ({ onChange, selected, placeholderText }) => (
        <input
            data-testid="mock-datepicker"
            placeholder={placeholderText}
            value={selected ? "2025-01-01" : ""}
            onChange={e => onChange(new Date("2025-12-01"))}
        />
    ),
}));


describe('Search Component', () => {

    const renderSearch = () => {
        return render(
            <BrowserRouter>
                <Search />
            </BrowserRouter>
        );
    };

    test.skip('1. renders search form and initial properties', () => {
        try {
            renderSearch();
            expect(screen.getByText(/Filter Properties/i)).toBeInTheDocument();
            // Check for at least one property
            expect(screen.getByText(/Elegant Urban Villa/i)).toBeInTheDocument();
            // Check that result count is initially 7
            expect(screen.getByText(/7/i)).toBeInTheDocument();
        } catch (error) {
            console.error("TEST FATAL ERROR:", error);
            throw error;
        }
    });

    test.skip('2. filters properties by price range', async () => {
        renderSearch();

        // Input Min Price
        const minPriceInput = screen.getByPlaceholderText(/Min Price/i);
        fireEvent.change(minPriceInput, { target: { value: '180000000' } }); // 180M

        // Input Max Price
        const maxPriceInput = screen.getByPlaceholderText(/Max Price/i);
        fireEvent.change(maxPriceInput, { target: { value: '200000000' } }); // 200M

        // Click Search
        const searchBtn = screen.getByText(/Search Properties/i);
        fireEvent.click(searchBtn);

        // Expect "Elegant Urban Villa" (185M)
        await waitFor(() => {
            expect(screen.getByText(/Elegant Urban Villa/i)).toBeInTheDocument();
            expect(screen.queryByText(/Modern Family Residence/i)).not.toBeInTheDocument(); // 72M
        });
    });

    test.skip('3. filters properties by type', async () => {
        renderSearch();

        const select = screen.getByTestId('mock-select');
        fireEvent.change(select, { target: { value: 'apartment' } });

        const searchBtn = screen.getByText(/Search Properties/i);
        fireEvent.click(searchBtn);

        await waitFor(() => {
            expect(screen.getByText(/Luxury City Apartment/i)).toBeInTheDocument();
            expect(screen.queryByText(/Elegant Urban Villa/i)).not.toBeInTheDocument();
        });
    });

    test.skip('4. adds property to favourites', async () => {
        renderSearch();

        const favButtons = screen.getAllByLabelText(/Add to favourites/i);
        fireEvent.click(favButtons[0]);

        // Check sidebar
        await waitFor(() => {
            // Sidebar header "Favorites (1)"
            const headers = screen.getAllByRole('heading', { level: 3 });
            const favHeader = headers.find(h => h.textContent.includes('Favorites (1)'));
            expect(favHeader).toBeInTheDocument();
        });
    });

    test.skip('5. removes property from favourites', async () => {
        renderSearch();

        // Add one
        const favButtons = screen.getAllByLabelText(/Add to favourites/i);
        fireEvent.click(favButtons[0]);

        await waitFor(() => expect(screen.getAllByRole('heading', { level: 3 }).find(h => h.textContent.includes('Favorites (1)'))).toBeInTheDocument());

        // Remove (click X in sidebar)
        const removeButtons = screen.getAllByLabelText(/Remove from favourites/i);
        // Usually the last one or sidebar one.
        fireEvent.click(removeButtons[removeButtons.length - 1]);

        await waitFor(() => {
            const headers = screen.getAllByRole('heading', { level: 3 });
            const favHeader = headers.find(h => h.textContent.includes('Favorites (0)'));
            expect(favHeader).toBeInTheDocument();
        });
    });

});
