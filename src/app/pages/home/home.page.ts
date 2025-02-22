import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { exampleGraph } from 'src/app/model/domain/example-graph';
import { FOLGraph } from 'src/app/model/domain/fol.graph';
import { graphCollectionQueryParams } from 'src/app/model/domain/graph.collection';
import { SnackBarService } from 'src/app/services/snack-bar.service';
import { cacheGraph, removeGraphFromStore } from 'src/app/store/actions';
import { State } from 'src/app/store/state';

/**
 * Home-page of the app.
 * Contains a list of (locally) saved graphs and the GraphImportComponent.
 */
@Component({
  selector: 'apollo-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  public readonly storedGraphs = this.store.select('graphStore').pipe(map((graphs) => Object.values(graphs)));

  public constructor(private readonly store: Store<State>, private readonly router: Router, private readonly snackBarService: SnackBarService) {}

  public onGraphSelected(graph: FOLGraph): void {
    this.router.navigate(['model-checker'], { queryParams: graphCollectionQueryParams('graphStore', graph.name) });
  }

  public onGraphDeletionRequested(graph: FOLGraph): void {
    this.store.dispatch(removeGraphFromStore({ key: graph.name }));
    this.snackBarService.graphDeleted(graph);
  }

  public onGraphImport(graph: FOLGraph): void {
    this.store.dispatch(cacheGraph(graph));
    this.router.navigate(['model-checker'], { queryParams: graphCollectionQueryParams('graphCache', graph.name) });
  }

  public navigateToExampleGraph() {
    this.router.navigate(['model-checker'], { queryParams: graphCollectionQueryParams('graphCache', exampleGraph.name) });
  }
}
