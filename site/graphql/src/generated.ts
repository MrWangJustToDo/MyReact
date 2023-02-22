/* eslint-disable */
// @ts-nocheck

import type * as SchemaTypes from "./schema";

import type { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
export type GetViewerQueryVariables = SchemaTypes.Exact<{
  first?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
}>;

export type GetViewerQuery = {
  viewer: {
    id: string;
    name?: string | null;
    login: string;
    email: string;
    createdAt: any;
    avatarUrl: any;
    websiteUrl?: any | null;
    projectsUrl: any;
    followers: { nodes?: Array<{ id: string; name?: string | null; login: string; email: string; bioHTML: any; avatarUrl: any } | null> | null };
    following: { nodes?: Array<{ id: string; name?: string | null; login: string; email: string; bioHTML: any; avatarUrl: any } | null> | null };
  };
};

export type GetBlogListQueryVariables = SchemaTypes.Exact<{
  name: SchemaTypes.Scalars["String"];
  owner: SchemaTypes.Scalars["String"];
  first?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  last?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  after?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
  before?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
  labels?: SchemaTypes.InputMaybe<Array<SchemaTypes.Scalars["String"]> | SchemaTypes.Scalars["String"]>;
  orderBy?: SchemaTypes.InputMaybe<SchemaTypes.IssueOrder>;
  states?: SchemaTypes.InputMaybe<Array<SchemaTypes.IssueState> | SchemaTypes.IssueState>;
  filterBy?: SchemaTypes.InputMaybe<SchemaTypes.IssueFilters>;
}>;

export type GetBlogListQuery = {
  repository?: {
    id: string;
    issues: {
      totalCount: number;
      nodes?: Array<{
        id: string;
        number: number;
        createdAt: any;
        publishedAt?: any | null;
        updatedAt: any;
        state: SchemaTypes.IssueState;
        title: string;
        body: string;
        bodyText: string;
        url: any;
        author?:
          | { login: string; avatarUrl: any }
          | { login: string; avatarUrl: any }
          | { login: string; avatarUrl: any }
          | { login: string; avatarUrl: any }
          | { login: string; avatarUrl: any }
          | null;
      } | null> | null;
      pageInfo: { endCursor?: string | null; startCursor?: string | null; hasNextPage: boolean; hasPreviousPage: boolean };
    };
  } | null;
};

export type GetSingleBlogQueryVariables = SchemaTypes.Exact<{
  name: SchemaTypes.Scalars["String"];
  owner: SchemaTypes.Scalars["String"];
  number: SchemaTypes.Scalars["Int"];
  first?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["Int"]>;
  after?: SchemaTypes.InputMaybe<SchemaTypes.Scalars["String"]>;
}>;

export type GetSingleBlogQuery = {
  repository?: {
    id: string;
    issue?: {
      id: string;
      body: string;
      title: string;
      number: number;
      createdAt: any;
      publishedAt?: any | null;
      updatedAt: any;
      author?:
        | { login: string; avatarUrl: any }
        | { login: string; avatarUrl: any }
        | { login: string; avatarUrl: any }
        | { login: string; avatarUrl: any }
        | { login: string; avatarUrl: any }
        | null;
      comments: {
        totalCount: number;
        nodes?: Array<{
          id: string;
          body: string;
          createdAt: any;
          updatedAt: any;
          viewerDidAuthor: boolean;
          author?:
            | { login: string; avatarUrl: any }
            | { login: string; avatarUrl: any }
            | { login: string; avatarUrl: any }
            | { login: string; avatarUrl: any }
            | { login: string; avatarUrl: any }
            | null;
        } | null> | null;
        pageInfo: { endCursor?: string | null; startCursor?: string | null; hasNextPage: boolean; hasPreviousPage: boolean };
      };
    } | null;
  } | null;
};

export const GetViewerDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getViewer" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "viewer" },
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                { kind: "Field", name: { kind: "Name", value: "name" } },
                { kind: "Field", name: { kind: "Name", value: "login" } },
                { kind: "Field", name: { kind: "Name", value: "email" } },
                { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                { kind: "Field", name: { kind: "Name", value: "websiteUrl" } },
                { kind: "Field", name: { kind: "Name", value: "projectsUrl" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "followers" },
                  arguments: [
                    { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "Variable", name: { kind: "Name", value: "first" } } },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "login" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } },
                            { kind: "Field", name: { kind: "Name", value: "bioHTML" } },
                            { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                          ],
                        },
                      },
                    ],
                  },
                },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "following" },
                  arguments: [
                    { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "Variable", name: { kind: "Name", value: "first" } } },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            { kind: "Field", name: { kind: "Name", value: "name" } },
                            { kind: "Field", name: { kind: "Name", value: "login" } },
                            { kind: "Field", name: { kind: "Name", value: "email" } },
                            { kind: "Field", name: { kind: "Name", value: "bioHTML" } },
                            { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetViewerQuery, GetViewerQueryVariables>;
export const GetBlogListDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getBlogList" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "last" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "before" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "labels" } },
          type: { kind: "ListType", type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "orderBy" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "IssueOrder" } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "states" } },
          type: { kind: "ListType", type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "IssueState" } } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "filterBy" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "IssueFilters" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "repository" },
            arguments: [
              { kind: "Argument", name: { kind: "Name", value: "name" }, value: { kind: "Variable", name: { kind: "Name", value: "name" } } },
              { kind: "Argument", name: { kind: "Name", value: "owner" }, value: { kind: "Variable", name: { kind: "Name", value: "owner" } } },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "issues" },
                  arguments: [
                    { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "Variable", name: { kind: "Name", value: "first" } } },
                    { kind: "Argument", name: { kind: "Name", value: "last" }, value: { kind: "Variable", name: { kind: "Name", value: "last" } } },
                    { kind: "Argument", name: { kind: "Name", value: "after" }, value: { kind: "Variable", name: { kind: "Name", value: "after" } } },
                    { kind: "Argument", name: { kind: "Name", value: "before" }, value: { kind: "Variable", name: { kind: "Name", value: "before" } } },
                    { kind: "Argument", name: { kind: "Name", value: "labels" }, value: { kind: "Variable", name: { kind: "Name", value: "labels" } } },
                    { kind: "Argument", name: { kind: "Name", value: "orderBy" }, value: { kind: "Variable", name: { kind: "Name", value: "orderBy" } } },
                    { kind: "Argument", name: { kind: "Name", value: "states" }, value: { kind: "Variable", name: { kind: "Name", value: "states" } } },
                    { kind: "Argument", name: { kind: "Name", value: "filterBy" }, value: { kind: "Variable", name: { kind: "Name", value: "filterBy" } } },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "nodes" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "id" } },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "author" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "login" } },
                                  { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "number" } },
                            { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                            { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                            { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                            { kind: "Field", name: { kind: "Name", value: "state" } },
                            { kind: "Field", name: { kind: "Name", value: "title" } },
                            { kind: "Field", name: { kind: "Name", value: "body" } },
                            { kind: "Field", name: { kind: "Name", value: "bodyText" } },
                            { kind: "Field", name: { kind: "Name", value: "url" } },
                          ],
                        },
                      },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "pageInfo" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                            { kind: "Field", name: { kind: "Name", value: "startCursor" } },
                            { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                            { kind: "Field", name: { kind: "Name", value: "hasPreviousPage" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetBlogListQuery, GetBlogListQueryVariables>;
export const GetSingleBlogDocument = {
  kind: "Document",
  definitions: [
    {
      kind: "OperationDefinition",
      operation: "query",
      name: { kind: "Name", value: "getSingleBlog" },
      variableDefinitions: [
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "name" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "owner" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "String" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "number" } },
          type: { kind: "NonNullType", type: { kind: "NamedType", name: { kind: "Name", value: "Int" } } },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "first" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "Int" } },
          defaultValue: { kind: "IntValue", value: "10" },
        },
        {
          kind: "VariableDefinition",
          variable: { kind: "Variable", name: { kind: "Name", value: "after" } },
          type: { kind: "NamedType", name: { kind: "Name", value: "String" } },
        },
      ],
      selectionSet: {
        kind: "SelectionSet",
        selections: [
          {
            kind: "Field",
            name: { kind: "Name", value: "repository" },
            arguments: [
              { kind: "Argument", name: { kind: "Name", value: "name" }, value: { kind: "Variable", name: { kind: "Name", value: "name" } } },
              { kind: "Argument", name: { kind: "Name", value: "owner" }, value: { kind: "Variable", name: { kind: "Name", value: "owner" } } },
            ],
            selectionSet: {
              kind: "SelectionSet",
              selections: [
                { kind: "Field", name: { kind: "Name", value: "id" } },
                {
                  kind: "Field",
                  name: { kind: "Name", value: "issue" },
                  arguments: [
                    { kind: "Argument", name: { kind: "Name", value: "number" }, value: { kind: "Variable", name: { kind: "Name", value: "number" } } },
                  ],
                  selectionSet: {
                    kind: "SelectionSet",
                    selections: [
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "author" },
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            { kind: "Field", name: { kind: "Name", value: "login" } },
                            { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                          ],
                        },
                      },
                      { kind: "Field", name: { kind: "Name", value: "id" } },
                      { kind: "Field", name: { kind: "Name", value: "body" } },
                      { kind: "Field", name: { kind: "Name", value: "title" } },
                      { kind: "Field", name: { kind: "Name", value: "number" } },
                      { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                      { kind: "Field", name: { kind: "Name", value: "publishedAt" } },
                      { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                      {
                        kind: "Field",
                        name: { kind: "Name", value: "comments" },
                        arguments: [
                          { kind: "Argument", name: { kind: "Name", value: "first" }, value: { kind: "Variable", name: { kind: "Name", value: "first" } } },
                          { kind: "Argument", name: { kind: "Name", value: "after" }, value: { kind: "Variable", name: { kind: "Name", value: "after" } } },
                        ],
                        selectionSet: {
                          kind: "SelectionSet",
                          selections: [
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "nodes" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "id" } },
                                  {
                                    kind: "Field",
                                    name: { kind: "Name", value: "author" },
                                    selectionSet: {
                                      kind: "SelectionSet",
                                      selections: [
                                        { kind: "Field", name: { kind: "Name", value: "login" } },
                                        { kind: "Field", name: { kind: "Name", value: "avatarUrl" } },
                                      ],
                                    },
                                  },
                                  { kind: "Field", name: { kind: "Name", value: "body" } },
                                  { kind: "Field", name: { kind: "Name", value: "createdAt" } },
                                  { kind: "Field", name: { kind: "Name", value: "updatedAt" } },
                                  { kind: "Field", name: { kind: "Name", value: "viewerDidAuthor" } },
                                ],
                              },
                            },
                            {
                              kind: "Field",
                              name: { kind: "Name", value: "pageInfo" },
                              selectionSet: {
                                kind: "SelectionSet",
                                selections: [
                                  { kind: "Field", name: { kind: "Name", value: "endCursor" } },
                                  { kind: "Field", name: { kind: "Name", value: "startCursor" } },
                                  { kind: "Field", name: { kind: "Name", value: "hasNextPage" } },
                                  { kind: "Field", name: { kind: "Name", value: "hasPreviousPage" } },
                                ],
                              },
                            },
                            { kind: "Field", name: { kind: "Name", value: "totalCount" } },
                          ],
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetSingleBlogQuery, GetSingleBlogQueryVariables>;
