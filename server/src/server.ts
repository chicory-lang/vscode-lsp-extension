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
import {TypeHint} from "@chicory-lang/compiler/build/env"

let typeHints: TypeHint[] = []


const connection = createConnection(ProposedFeatures.all);

const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

connection.onInitialize((params: InitializeParams) => {
  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      hoverProvider: true
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
      console.log("Document changed:", change.document.uri)
      const { errors, hints } = compile(text);
      connection.sendDiagnostics({
        uri: change.document.uri,
        diagnostics: errors as Diagnostic[]
      })
      typeHints = hints;
    }
    catch (e) {
      console.error("Validation error:")
      console.error(e)
    }
});


connection.onHover((params) => {
  const document = documents.get(params.textDocument.uri);
  if (!document) {
    return null;
  }
  const position = params.position;
  const offset = document.offsetAt(position);
  
  console.log(offset)

  const validHints = typeHints.filter((hint) => {
    const start = document.offsetAt(hint.range.start);
    const end = document.offsetAt(hint.range.end);
    return offset >= start && offset <= end;
  });
  const hintsByLength = validHints.sort((a, b) => 
    (document.offsetAt(b.range.end) - document.offsetAt( b.range.start)) -
    (document.offsetAt(a.range.end) - document.offsetAt( a.range.start)) 
);
  console.error(hintsByLength)
  const hint = hintsByLength?.[0]
  
  if (hint) {
    return {
      contents: hint.type,
    };
  }
  return null;
});

documents.listen(connection);
connection.listen();
