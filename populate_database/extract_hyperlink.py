import openpyxl


def extract_hyperlinks(file_path, column_name):
    # Load the workbook
    workbook = openpyxl.load_workbook(file_path)

    # Select the first sheet
    sheet = workbook.worksheets[0]

    # Find the column index for the specified column name
    for i, cell in enumerate(sheet[1]):
        if cell.value == column_name:
            column_index = i
            break
    else:
        raise ValueError(f'Column "{column_name}" not found in the sheet')

    # Iterate over the cells in the specified column
    for cell in sheet.iter_cols(min_col=column_index + 1, max_col=column_index + 1, min_row=2):
        for cell in cell:
            # Check if the cell has a hyperlink
            if cell.hyperlink:
                # Write the hyperlink to the next cell in the same row
                imdbId = cell.hyperlink.target.split("/")[4]
                if imdbId[:2] == "tt":
                    sheet[cell.row][cell.column].value = imdbId
                if cell.row % 10 == 0:
                    print(cell.row)

    # Save the workbook
    workbook.save(file_path)


# Use the function
extract_hyperlinks("StartingList.xlsx", "IMDb")
