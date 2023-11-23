#include <mpi.h>
#include <stdio.h>

void barrier(int rank, int size) {
    if (rank != 0) {
        // Processi non-zero inviano messaggi al processo 0
        MPI_Send(NULL, 0, MPI_INT, 0, 0, MPI_COMM_WORLD);
        // Processi non-zero ricevono messaggi di ritorno dal processo 0
        MPI_Recv(NULL, 0, MPI_INT, 0, 1, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
    } else {
        // Processo 0 riceve messaggi da tutti i processi non-zero
        for (int src = 1; src < size; src++) {
            MPI_Recv(NULL, 0, MPI_INT, src, 0, MPI_COMM_WORLD, MPI_STATUS_IGNORE);
        }
        // Processo 0 invia messaggi di ritorno a tutti i processi non-zero
        for (int dest = 1; dest < size; dest++) {
            MPI_Send(NULL, 0, MPI_INT, dest, 1, MPI_COMM_WORLD);
        }
    }
}

int main(int argc, char *argv[]) {
    int rank, size;

    MPI_Init(&argc, &argv);
    MPI_Comm_size(MPI_COMM_WORLD, &size);
    MPI_Comm_rank(MPI_COMM_WORLD, &rank);

    printf("Process %d: Before Barrier\n", rank);

    // Chiamata alla funzione di barriera personalizzata
    barrier(rank, size);

    printf("Process %d: After Barrier\n", rank);

    MPI_Finalize();
    return 0;
}
