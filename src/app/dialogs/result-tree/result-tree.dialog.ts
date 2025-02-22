import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';

import { ModelCheckerResponse } from 'src/app/model/api/model-checker-response';
import { ModelCheckerTrace } from 'src/app/model/api/model-checker-trace';
import { SnackBarService } from 'src/app/services/snack-bar.service';

interface FlatTraceNode {
  trace: ModelCheckerTrace;
  expandable: boolean;
  visible: boolean;
  level: number;
}

/**
 * Dialog that shows the result of a ModelChecking request in a tree-structure.
 * Provides options to control the tree, depending on the feedback level.
 */
@Component({
  templateUrl: './result-tree.dialog.html',
  styleUrls: ['./result-tree.dialog.scss'],
})
export class ResultTreeDialog implements OnInit {
  public readonly treeControl = new FlatTreeControl<FlatTraceNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  public readonly dataSource = new MatTreeFlatDataSource(
    this.treeControl,
    new MatTreeFlattener(
      traceToFlatNode,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.children
    )
  );

  public constructor(
    private readonly dialogRef: MatDialogRef<ResultTreeDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly result: ModelCheckerResponse,
    private readonly snackBarService: SnackBarService
  ) {}

  public ngOnInit(): void {
    this.dataSource.data = [this.result.rootTrace];
    if (this.result.feedback === 'relevant') {
      this.expandAll();
    }
  }

  public closeDialog(): void {
    this.dialogRef.close();
  }

  public hasChild(_: number, node: FlatTraceNode): boolean {
    return node.expandable;
  }

  public expandAll(): void {
    try {
      this.treeControl.expandAll();
    } catch (_) {
      this.snackBarService.openSnackBar({ key: 'result-tree.expand-error' });
    }
  }

  public updateFilter(filter: boolean): void {
    if (!filter) {
      // Set all nodes to visible.
      this.treeControl.dataNodes.forEach((node) => (node.visible = true));
    } else {
      // Recursively, set irrelevant nodes to invisible.
      this.filterCauses(this.treeControl.dataNodes[0], this.result.rootTrace.isModel, true);
    }
  }

  private filterCauses(node: FlatTraceNode, expected: boolean, parentIsVisible: boolean): void {
    // Check if trace behaved as required.
    const actual = node.trace.isModel === node.trace.shouldBeModel;
    // Check if filtering is for positive or negative causes
    const visible = parentIsVisible && actual === expected;
    node.visible = visible;
    // Currently, there's no method to retrieve immediate children for the FlatTreeControl.
    // As a workaround, we get all descendants and filter them by their level.
    this.treeControl.getDescendants(node).forEach((child) => {
      if (child.level === node.level + 1) {
        this.filterCauses(child, expected, visible);
      }
    });
  }
}

function traceToFlatNode(trace: ModelCheckerTrace, level: number): FlatTraceNode {
  return {
    trace,
    expandable: !!trace.children && trace.children.length > 0,
    visible: true,
    level,
  };
}
