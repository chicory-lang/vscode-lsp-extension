import {
  createConnection,
  TextDocuments,
  ProposedFeatures,
  InitializeParams,
  TextDocumentSyncKind,
  InitializeResult,
  Diagnostic,
} from "vscode-languageserver/node";
import { TextDocument } from "vscode-languageserver-textdocument";
import compile from "@chicory-lang/compiler"

const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
    },
  };

  return result;
});

documents.onDidChangeContent((change) => {
  // connection.window.showInformationMessage(
  //   "onDidChangeContent: " + change.document.uri
  // );
  try {
      const text = change.document.getText();
      console.warn(change.document.uri)
      const { errors } = compile(text);
      console.warn("Compile returned errors:", JSON.stringify(errors, null, 2));
      connection.sendDiagnostics({
        uri: change.document.uri,
        diagnostics: errors as Diagnostic[]
      })
      console.warn("Diagnostics sent successfully");
    }
    catch (e) {
      console.error("Validation error:")
      console.error(e)
    }
});

documents.listen(connection);
connection.listen();
