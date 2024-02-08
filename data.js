export async function fetchData() {
    let data = []
    try {
        // const response = await fetch('newData.json')
        const response = await fetch('./backEndPython/newData3.json')
        data = await response.json()
    } catch (error) {
        console.error('Error:', error)
    }

    // Return the fetched data
    return data
}
