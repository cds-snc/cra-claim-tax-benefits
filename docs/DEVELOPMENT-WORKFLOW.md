[La version française suit.](#développement-agile-au-snc)

# Agile development workflow

1. Development sprints are two weeks long.
2. At the beginning of a sprint, the development team meets with the members of the larger team to discuss priorities for new features.
3. The development team reviews open issues from the last sprint and prioritizes them with the next development targets.
4. Developers self-assign issues from the list of open issues in Trello or GitHub.
5. To resolve an issue, a developer:

   - Checks out a new branch from main
   - Builds the feature or resolves the bug described in the issue
   - Continuously commits code to their branch at sensible intervals
   - Writes unit and integration tests where appropriate for the code they have added
   - Changes/removes unit and integration tests for code they have modified
   - Runs the test suite(s) and ensures all tests pass
   - Commits the final code, pushes the code to GitHub, and opens a pull request in GitHub
   - Awaits [GitHub Actions](https://github.com/features/actions) to verify that all tests pass on CI
   - Spot check features using Heroku [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps)
   - Requests other members of the team [review the pull request](https://github.com/cds-snc/cra-claim-tax-benefits/blob/main/docs/CODE-REVIEW-GUIDELINES.md).
   - If other team members have comments, they will note these in GitHub for the developer to either fix them or discuss
   - Other team members approve the pull request after all discussions have been resolved
   - Pull requests are then merged to main by the author of the pull request
   - [GitHub Actions](https://github.com/features/actions) verify once more that all tests pass on the updated main and then deploys the code into production

6. This process is repeated iteratively until a new sprint starts.
7. At the end of a sprint, the development team reviews the issues completed and suggests improvements for the next sprint.

## ---------------------------------------------------------------------

# Déroulement du développement agile

1. Les sprints de développement durent deux semaines.
2. Au début d’un sprint, l’équipe de développement se réunit avec les autres membres de la grande équipe afin de discuter des priorités pour le développement des nouvelles fonctionnalités.
3. L’équipe de développement examine les problèmes non résolus depuis le dernier sprint et les met en ordre de priorité avec les prochains objectifs de développement.
4. Les développeurs s’attribuent des problèmes à partir de la liste de problèmes non résolus dans Trello ou GitHub.
5. Pour résoudre un problème, un développeur :

   - consulte une nouvelle branche du main;
   - élabore la fonctionnalité ou résout le bogue décrit dans le problème;
   - valide continuellement le code dans sa branche à des intervalles raisonnables;
   - écrit des tests unitaires et d’intégration pour le code qu’il a ajouté;
   - modifie ou supprime les tests unitaires et d’intégration pour le code qu’il a modifié;
   - exécute les tests pour s’assurer que tous les tests sont réussis;
   - valide le code final, pousse le code dans GitHub et ouvre une demande de tirage dans GitHub;
   - attend les [Actions GitHub](https://github.com/features/actions) pour vérifier que tous nos tests seront réussis;
   - effectue des vérifications ponctuelles à l’aide des applications d’examen Heroku [Review Apps](https://devcenter.heroku.com/articles/github-integration-review-apps);
   - demande aux autres membres de l’équipe d’examiner la demande de tirage
   - si d’autres membres de l’équipe ont des commentaires, ils les indiqueront dans GitHub pour que le développeur corrige des erreurs ou en discute;
   - d’autres membres de l’équipe approuvent la demande de tirage une fois que toutes les discussions en suspens ont été résolues;
   - les demandes de tirage sont ensuite fusionnées dans main par l’auteur;
   - [Actions GitHub](https://github.com/features/actions) vérifie encore une fois que tous les tests sont réussis sur le main à jour et déploie le code en production.

6. Ce processus est répété de façon itérative jusqu’à ce qu’un nouveau sprint démarre.
7. À la fin d’un sprint, l’équipe de développement examine les problèmes et suggère des améliorations pour le prochain sprint.
