document.getElementById("deleteButton").addEventListener("click", function(event) {
    if (!confirm("Are you sure you want to delete this tenant?")) {
        event.preventDefault(); 
    }
});