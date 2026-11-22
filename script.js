const eventsList = document.querySelector("#events-list");

async function renderRepositories() {
  try {
    const response = await fetch("events.json");

    if (!response.ok) {
      throw new Error(`Unable to load repositories (${response.status})`);
    }

    const repositories = await response.json();
    eventsList.replaceChildren();

    repositories.forEach((repository) => {
      const item = document.createElement("li");
      item.className = "repository";

      const name = document.createElement("a");
      name.className = "repository-name";
      name.href = repository.url;
      name.textContent = repository.name;
      name.target = "_blank";
      name.rel = "noopener noreferrer";

      const description = document.createElement("p");
      description.className = "repository-description";
      description.textContent = repository.description;

      const meta = document.createElement("p");
      meta.className = "repository-meta";
      meta.textContent = [
        `Language: ${repository.language}`,
        `Stars: ${repository.stars.toLocaleString()}`,
        `Starred: ${repository.starred_at}`,
      ].join(" | ");

      item.append(name, description, meta);
      eventsList.append(item);
    });
  } catch (error) {
    const message = document.createElement("li");
    message.className = "error";
    message.textContent = error.message;
    eventsList.replaceChildren(message);
  }
}

renderRepositories();
