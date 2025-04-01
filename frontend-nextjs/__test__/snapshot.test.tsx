import '@testing-library/jest-dom'
import { describe } from 'node:test'
import { render, screen } from '@testing-library/react'
import Test_jest from '@/components/test_jest'

describe(
    "<Test_jest />", () => {

        test('should first', async () => {
            render(<Test_jest />)
            const text = screen.getByText("test_jest")
            expect(text).toBeInTheDocument();
        });
        test("should have button", () => {
            render(<Test_jest />)
            const button = screen.getByRole("button",
                {
                    name: "Getting started"
                }
            )
            expect(button).toBeInTheDocument();
        })

    }
)