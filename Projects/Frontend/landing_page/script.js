var searchInput = document.getElementById('search');
var suggestionsContainer = document.getElementById('suggestions');

searchInput.addEventListener('input', function() {
    var query = this.value;
    updateSuggestions(query);
});

function updateSuggestions(query) {
    suggestionsContainer.innerHTML = ''; 

    if (query.length === 0) {
        suggestionsContainer.style.display = 'none'; 
        return;
    }

    var suggestions = simulateSuggestions(query);

    if (suggestions.length > 0) {
        suggestionsContainer.style.display = 'block'; 
    } else {
        suggestionsContainer.style.display = 'none'; 
        return;
    }

    suggestions.forEach(function(suggestion) {
        var suggestionItem = document.createElement('li');
        suggestionItem.textContent = suggestion;
        suggestionItem.addEventListener('click', function() {
            searchInput.value = suggestion;
            suggestionsContainer.style.display = 'none'; 
        });
        suggestionsContainer.appendChild(suggestionItem);
    });
}

function simulateSuggestions(query) {
    // to be changed
    var mockSuggestions = [
        'fruit',
        'apple',
        'Suggestion 3',
    ];

    var filteredSuggestions = mockSuggestions.filter(function(suggestion) {
        return suggestion.toLowerCase().includes(query.toLowerCase());
    });

    return filteredSuggestions;
}
